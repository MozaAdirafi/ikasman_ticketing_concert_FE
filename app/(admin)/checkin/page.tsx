'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCheckin } from '@/hooks/useCheckin'
import { QRScanner } from '@/components/checkin/QRScanner'
import { ScanResult } from '@/components/checkin/ScanResult'
import type { CheckinResponse } from '@/types'

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? '1234'
const ADMIN_PIN_STORAGE_KEY = 'admin_pin_session'
type CheckinError = Error & { status?: number }

export default function CheckinPage() {
  const isLockedRef = useRef(false)
  const [showScanner, setShowScanner] = useState(true)
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pinError, setPinError] = useState(false)
  const [result, setResult] = useState<CheckinResponse | null>(null)

  const { mutate } = useCheckin()

  useEffect(() => {
    const savedPin = sessionStorage.getItem(ADMIN_PIN_STORAGE_KEY)
    if (savedPin && savedPin === ADMIN_PIN) {
      setPin(savedPin)
      setAuthenticated(true)
    }
  }, [])

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(ADMIN_PIN_STORAGE_KEY, pin)
      setAuthenticated(true)
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 2000)
    }
  }

  const handleScanResult = (qrCode: string) => {
    if (isLockedRef.current) return

    isLockedRef.current = true
    setShowScanner(false)

    mutate(
      { qr_code: qrCode, adminPin: pin },
      {
        onSuccess: (data) => {
          setResult(data)
        },
        onError: (err) => {
          const error = err as CheckinError
          const message = error.status === 401 ? 'PIN tidak valid' : error.message
          setResult({ valid: false, ticket_holder: '', ticket_type: '', message })
        },
        onSettled: () => {
          setTimeout(() => {
            setResult(null)
            setShowScanner(true)
            isLockedRef.current = false
          }, 4000)
        },
      }
    )
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
            Buka →
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy flex flex-col">
      <header className="px-5 pt-8 pb-5 border-b border-cream/10 flex items-start justify-between gap-3">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold mb-1">Admin</p>
          <h1 className="font-display text-xl font-800 text-cream">Scan Tiket</h1>
        </div>
        <Link href="/admin" className="text-xs text-cream/60 hover:text-gold transition-colors">
          Dashboard
        </Link>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        {result && <ScanResult result={result} />}

        {showScanner ? (
          <QRScanner onScan={handleScanResult} />
        ) : (
          <div style={{ display: 'none' }} />
        )}
      </section>
    </main>
  )
}
