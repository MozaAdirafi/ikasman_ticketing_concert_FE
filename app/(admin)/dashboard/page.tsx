'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? '1234'
const ADMIN_PIN_STORAGE_KEY = 'admin_pin_session'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

type StatusFilter = 'all' | 'present' | 'absent'
type TicketFilter = 'all' | 'PLATINUM' | 'GOLD' | 'SILVER'

interface DashboardStats {
  totalSold: number
  totalPresent: number
  totalAbsent: number
  totalRevenue: number
}

interface Attendee {
  id: string
  name: string
  email: string
  whatsapp: string
  ticket_type: string
  order_id: string
  qr_code: string
  is_used: boolean
  used_at: string | null
  created_at: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace('IDR', '')
    .trim()
}

function normalizeTicketType(ticketType: string): 'PLATINUM' | 'GOLD' | 'SILVER' {
  const upper = (ticketType || '').toUpperCase()
  if (upper.includes('PLATINUM')) return 'PLATINUM'
  if (upper.includes('GOLD')) return 'GOLD'
  return 'SILVER'
}

function ticketBadgeClass(ticketType: string): string {
  const tier = normalizeTicketType(ticketType)
  if (tier === 'PLATINUM') return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40'
  if (tier === 'GOLD') return 'bg-orange-500/20 text-orange-300 border-orange-400/40'
  return 'bg-slate-400/20 text-slate-200 border-slate-300/40'
}

function formatCheckinTime(usedAt: string | null | undefined): string {
  if (!usedAt || usedAt === 'null' || usedAt === '') return '-'

  try {
    const date = new Date(usedAt)
    if (Number.isNaN(date.getTime())) return '-'

    // Convert UTC to WIB (UTC+7)
    const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
    const hours = wibDate.getUTCHours().toString().padStart(2, '0')
    const minutes = wibDate.getUTCMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes} WIB`
  } catch {
    return '-'
  }
}

function formatOrderNumber(orderNumber?: string): string {
  if (!orderNumber) return '-'
  return orderNumber.slice(0, 8).toUpperCase()
}

function formatWhatsappLink(whatsapp?: string): string {
  if (!whatsapp) return '#'
  const digitsOnly = whatsapp.replace(/\D/g, '')

  if (digitsOnly.startsWith('62')) return `https://wa.me/${digitsOnly}`
  if (digitsOnly.startsWith('0')) return `https://wa.me/62${digitsOnly.slice(1)}`
  return `https://wa.me/62${digitsOnly}`
}

function parseAttendeesResponse(raw: unknown): Attendee[] {
  const source = raw as
    | { attendees?: unknown[]; data?: unknown[] }
    | unknown[]
    | undefined

  const rows = Array.isArray(source)
    ? source
    : Array.isArray(source?.attendees)
      ? source.attendees
      : Array.isArray(source?.data)
        ? source.data
        : []

  const attendees = rows.map((row) => {
    const item = row as Record<string, unknown>

    return {
      id: String(item.id ?? item.attendee_id ?? ''),
      name: String(item.name ?? item.ticket_holder ?? item.attendee_name ?? '-'),
      email: String(item.email ?? item.buyer_email ?? ''),
      whatsapp: String(item.whatsapp ?? item.phone ?? item.phone_number ?? ''),
      ticket_type: String(item.ticket_type ?? item.tier ?? item.ticket_name ?? 'SILVER'),
      order_id: String(item.order_id ?? item.order_number ?? item.order_no ?? ''),
      qr_code: String(item.qr_code ?? item.qr ?? ''),
      is_used: item.is_used === true || item.checked_in === true || item.is_checked_in === true,
      used_at: item.used_at ? String(item.used_at) : item.checked_in_at ? String(item.checked_in_at) : null,
      created_at: String(item.created_at ?? ''),
    }
  })

  // Debug log
  if (attendees.length > 0) {
    console.log('First attendee:', attendees[0])
    console.log('used_at value:', attendees[0]?.used_at)
  }

  return attendees
}

function sumTierValues(value: unknown): number {
  if (typeof value === 'number') return value

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).reduce((sum, item) => {
      const parsed = Number(item)
      return sum + (Number.isFinite(parsed) ? parsed : 0)
    }, 0)
  }

  return 0
}

function parseStatsResponse(raw: unknown, attendees: Attendee[]): DashboardStats {
  const source = (raw as Record<string, unknown>) ?? {}

  const soldFromApi = sumTierValues(source.total_sold ?? source.total_terjual)
  const presentFromApi = sumTierValues(
    source.total_checked_in ?? source.total_present ?? source.total_hadir
  )

  const totalSold = soldFromApi || attendees.length
  const totalPresent = presentFromApi || attendees.filter((a) => a.is_used).length

  const explicitAbsent = sumTierValues(source.total_absent ?? source.total_belum_hadir)
  const totalAbsent = explicitAbsent || Math.max(totalSold - totalPresent, 0)
  const totalRevenue = Number(source.total_revenue ?? source.total_pendapatan ?? 0)

  return {
    totalSold,
    totalPresent,
    totalAbsent,
    totalRevenue,
  }
}

async function fetchDashboard(pin: string): Promise<unknown> {
  const { data } = await axios.get(`${API_BASE_URL}/api/v1/admin/dashboard`, {
    headers: {
      'X-Admin-PIN': pin,
    },
  })

  return data
}

async function fetchAttendees(pin: string, search: string, status: StatusFilter, ticket: TicketFilter): Promise<unknown> {
  const statusParam = status === 'all' ? undefined : status === 'present' ? 'checked_in' : 'not_checked_in'
  const ticketParam = ticket === 'all' ? undefined : ticket

  const { data } = await axios.get(`${API_BASE_URL}/api/v1/admin/attendees`, {
    headers: {
      'X-Admin-PIN': pin,
    },
    params: {
      search: search || undefined,
      status: statusParam,
      ticket_type: ticketParam,
    },
  })

  return data
}

export default function AdminDashboardPage() {
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pinError, setPinError] = useState(false)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [ticketFilter, setTicketFilter] = useState<TicketFilter>('all')
  const [csvLoading, setCsvLoading] = useState(false)

  useEffect(() => {
    const savedPin = sessionStorage.getItem(ADMIN_PIN_STORAGE_KEY)
    if (savedPin && savedPin === ADMIN_PIN) {
      setPin(savedPin)
      setAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timeout)
  }, [search])

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(ADMIN_PIN_STORAGE_KEY, pin)
      setAuthenticated(true)
      return
    }

    setPinError(true)
    setTimeout(() => setPinError(false), 2000)
  }

  const attendeesQuery = useQuery({
    queryKey: ['admin-attendees', pin, debouncedSearch, statusFilter, ticketFilter],
    queryFn: () => fetchAttendees(pin, debouncedSearch, statusFilter, ticketFilter),
    enabled: authenticated && !!pin,
    refetchInterval: 30_000,
  })

  const dashboardQuery = useQuery({
    queryKey: ['admin-dashboard', pin],
    queryFn: () => fetchDashboard(pin),
    enabled: authenticated && !!pin,
    refetchInterval: 30_000,
  })

  const attendees = useMemo(
    () => parseAttendeesResponse(attendeesQuery.data),
    [attendeesQuery.data]
  )

  const stats = useMemo(
    () => parseStatsResponse(dashboardQuery.data, attendees),
    [dashboardQuery.data, attendees]
  )

  async function handleDownloadCsv() {
    try {
      setCsvLoading(true)

      const statusParam = statusFilter === 'all' ? undefined : statusFilter === 'present' ? 'checked_in' : 'not_checked_in'
      const ticketParam = ticketFilter === 'all' ? undefined : ticketFilter

      const response = await axios.get<string>(`${API_BASE_URL}/api/v1/admin/attendees/export`, {
        headers: {
          'X-Admin-PIN': pin,
        },
        params: {
          search: debouncedSearch || undefined,
          status: statusParam,
          ticket_type: ticketParam,
        },
        responseType: 'text',
      })

      const csvData = response.data
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'attendees-kirribilly-2026.csv'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setCsvLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center px-5">
        <form onSubmit={handlePinSubmit} className="w-full max-w-xs flex flex-col gap-4">
          <h1 className="font-display text-xl font-800 text-cream text-center mb-2">
            Akses Admin
          </h1>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Masukkan PIN"
            className={`
              bg-navy-muted border ${pinError ? 'border-red-500' : 'border-cream/20'}
              text-cream text-center text-2xl tracking-[0.5em] px-4 py-3
              focus:outline-none focus:border-gold transition-colors
            `}
            maxLength={8}
          />
          {pinError && (
            <p className="text-red-400 text-sm text-center font-ui">PIN salah</p>
          )}
          <button
            type="submit"
            className="bg-gold text-navy font-display font-700 uppercase tracking-wider py-3"
          >
            Buka Dashboard →
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy px-4 py-6 md:px-8 md:py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold mb-1">Admin</p>
          <h1 className="font-display text-2xl font-800 text-cream">Dashboard Check-in</h1>
        </div>
        <Link href="/checkin" className="text-sm text-cream/70 hover:text-gold transition-colors">
          Ke Scanner
        </Link>
      </header>

      {/* Stats cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Terjual', value: stats.totalSold },
          { label: 'Total Hadir', value: stats.totalPresent },
          { label: 'Total Belum Hadir', value: stats.totalAbsent },
          { label: 'Total Pendapatan', value: formatPrice(stats.totalRevenue) },
        ].map((card) => (
          <div key={card.label} className="bg-navy-light border border-gold/20 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-cream/50 mb-2">{card.label}</p>
            <p className="font-display text-2xl font-900 text-cream">{card.value}</p>
          </div>
        ))}
      </section>

      {/* Filter bar */}
      <section className="bg-navy-light border border-white/10 rounded-lg p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama..."
            className="w-full lg:w-72 bg-navy border border-white/20 rounded px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-navy border border-white/20 rounded px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold"
          >
            <option value="all">Semua</option>
            <option value="present">Sudah Hadir</option>
            <option value="absent">Belum Hadir</option>
          </select>

          <select
            value={ticketFilter}
            onChange={(e) => setTicketFilter(e.target.value as TicketFilter)}
            className="bg-navy border border-white/20 rounded px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold"
          >
            <option value="all">Semua Tiket</option>
            <option value="PLATINUM">Platinum</option>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
          </select>

          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={csvLoading}
            className="lg:ml-auto bg-gold text-navy font-700 text-sm px-4 py-2 rounded disabled:opacity-60"
          >
            {csvLoading ? 'Mengunduh...' : 'Download CSV'}
          </button>
        </div>
      </section>

      {/* Attendees table */}
      <section className="bg-navy-light border border-white/10 rounded-lg overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-white/10">
            <tr className="text-left text-xs uppercase tracking-wide text-gold">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jenis Tiket</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Waktu Check-in</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">No. Pesanan</th>
            </tr>
          </thead>
          <tbody>
            {attendeesQuery.isLoading ? (
              <tr>
                <td className="px-4 py-8 text-center text-cream/50" colSpan={7}>
                  Memuat data attendee...
                </td>
              </tr>
            ) : attendeesQuery.isError ? (
              <tr>
                <td className="px-4 py-8 text-center text-red-300" colSpan={7}>
                  Gagal memuat data attendee.
                </td>
              </tr>
            ) : attendees.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-cream/50" colSpan={7}>
                  Tidak ada data attendee.
                </td>
              </tr>
            ) : (
              attendees.map((attendee, index) => (
                <tr key={`${attendee.orderNumber}-${index}`} className="odd:bg-navy-light even:bg-navy-muted/40">
                  <td className="px-4 py-3 text-sm text-cream/80">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-cream">{attendee.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs ${ticketBadgeClass(attendee.ticket_type)}`}>
                      {normalizeTicketType(attendee.ticket_type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-600 ${
                        attendee.is_used
                          ? 'bg-green-500/20 text-green-300 border border-green-400/40'
                          : 'bg-slate-500/20 text-slate-200 border border-slate-400/40'
                      }`}
                    >
                      {attendee.is_used ? 'Hadir' : 'Belum'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-cream/80">{attendee.is_used ? formatCheckinTime(attendee.used_at) : '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    {attendee.whatsapp ? (
                      <a
                        href={formatWhatsappLink(attendee.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300 hover:text-sky-200"
                      >
                        {attendee.whatsapp}
                      </a>
                    ) : (
                      <span className="text-cream/50">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-cream/80">{formatOrderNumber(attendee.order_id)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}
