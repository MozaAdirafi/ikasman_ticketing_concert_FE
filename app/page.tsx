'use client'

import Image from 'next/image'
import { useState } from 'react'
import { IconCalendar, IconMapPin, IconUser } from '@tabler/icons-react'
import { useTickets } from '@/hooks/useTickets'
import { MinimalTicketCard, type CartItem } from '@/components/ticket/MinimalTicketCard'
import { OrderSummaryBar } from '@/components/ticket/OrderSummaryBar'
import { OrderDetailModal } from '@/components/ticket/OrderDetailModal'
import { Toast } from '@/components/ui/Toast'
import type { Ticket } from '@/types'

export default function LandingPage() {
  const { data: tickets, isLoading, error } = useTickets()
  const [cart, setCart] = useState<CartItem[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showPoster, setShowPoster] = useState(false)

  function handleQuantityChange(ticket: Ticket, quantity: number) {
    setCart((prevCart) => {
      // If quantity is 0, remove from cart
      if (quantity === 0) {
        return prevCart.filter((item) => item.ticket.id !== ticket.id)
      }

      // Check if item already in cart
      const existingItem = prevCart.find((item) => item.ticket.id === ticket.id)

      if (existingItem) {
        // Update quantity
        return prevCart.map((item) =>
          item.ticket.id === ticket.id ? { ...item, quantity } : item
        )
      } else {
        // Add to cart
        return [...prevCart, { ticket, quantity }]
      }
    })
  }

  return (
    <main className="min-h-screen bg-navy flex flex-col pb-32">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('/concert-banner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Blur + dark overlay — blurs only the background, not the content */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(16px)',
            background: 'rgba(8, 12, 24, 0.82)',
          }}
        />

        {/* Content row */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 px-5 py-6 md:p-10">
          {/* LEFT — event info */}
          <div className="flex-1 min-w-0 md:pr-10">
            <p
              style={{
                color: '#FBBF24',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '12px',
              }}
              className="text-[10px] md:text-[11px]"
            >
              LIVE CONCERT
            </p>

            <h1
              className="font-display text-[36px] md:text-[64px]"
              style={{
                color: '#ffffff',
                fontWeight: 700,
                lineHeight: 1.0,
                marginBottom: '4px',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              Kirribilly
            </h1>
            <p
              className="font-display text-[24px] md:text-[40px]"
              style={{
                color: '#FBBF24',
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: '24px',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              Road to Liverpool
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="flex items-start gap-3 text-[13px] md:text-[15px]" style={{ color: '#CBD5E1' }}>
                <IconCalendar size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
                <span>Kamis, 30 Juli 2026 · 19:30 – 22:00 WIB</span>
              </div>
              <div className="flex items-start gap-3 text-[13px] md:text-[15px]" style={{ color: '#CBD5E1' }}>
                <IconMapPin size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
                <span>Deheng House, Jl. Taman Kemang No.32, Jakarta Selatan</span>
              </div>
              <div className="flex items-start gap-3 text-[13px] md:text-[15px]" style={{ color: '#CBD5E1' }}>
                <IconUser size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
                <span>Feat. Cakra Khan & Astrid</span>
              </div>
            </div>
          </div>

          {/* RIGHT — poster image */}
          <div className="hidden md:block" style={{ width: '420px', flexShrink: 0 }}>
            <div style={{ cursor: 'pointer' }} onClick={() => setShowPoster(true)}>
              <div
                style={{
                  background: '#0a0e1a',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                }}
              >
                <Image
                  src="/concert-banner.jpg"
                  alt="Kirribilly – Road to Liverpool"
                  width={420}
                  height={300}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', objectPosition: 'center center' }}
                />
              </div>
              <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '11px', marginTop: '8px' }}>
                Lihat poster
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: '1px', background: '#FBBF24', width: '100%' }} />

      {/* Tickets section */}
      <section className="w-full px-4 py-6 md:px-6 md:py-12">
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 className="font-display text-white font-semibold" style={{ fontSize: '18px' }}>Pilih Tiket</h2>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-white/5 border border-white/10 rounded animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="border border-red-500/30 bg-red-950/20 rounded-lg p-8 text-center">
              <p className="text-red-400 font-ui">Gagal memuat tiket. Silakan muat ulang halaman.</p>
            </div>
          ) : tickets && tickets.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[...tickets]
                .sort((a, b) => b.price - a.price)
                .map((ticket) => {
                  const cartItem = cart.find((item) => item.ticket.id === ticket.id)
                  return (
                    <MinimalTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      quantity={cartItem?.quantity ?? 0}
                      onQuantityChange={(qty) => handleQuantityChange(ticket, qty)}
                    />
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 font-ui">Tiket belum tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* Event description */}
      <section className="px-4 pb-12 md:px-6" style={{ paddingTop: 0 }}>
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            borderTop: '1px solid #1e2640',
            paddingTop: '32px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
          }}
          className="md:[grid-template-columns:1fr_1fr]"
        >
          {/* Left: about */}
          <div>
            <h3
              className="font-display"
              style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}
            >
              Tentang Acara
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.7 }}>
              Kirribilly, band tribute Beatles terbaik Indonesia, hadir dalam konser spesial Road to
              Liverpool. Malam yang penuh harmoni bersama Cakra Khan dan Astrid dalam rangka mendukung
              perjalanan Kirribilly ke International Beatleweek 2026 di Liverpool, Inggris.
            </p>
          </div>

          {/* Right: detail rows */}
          <div>
            <h3
              className="font-display"
              style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}
            >
              Detail Acara
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {([
                { label: 'Tanggal', value: 'Kamis, 30 Juli 2026' },
                { label: 'Waktu',   value: '19:30 – 22:00 WIB' },
                { label: 'Tempat',  value: 'Deheng House' },
                { label: 'Alamat',  value: 'Jl. Taman Kemang No.32, Jakarta Selatan' },
              ] as { label: string; value: string }[]).map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ color: '#94A3B8', fontSize: '12px', width: '60px', flexShrink: 0 }}>{label}</span>
                  <span style={{ color: '#ffffff', fontSize: '13px' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Poster lightbox */}
      {showPoster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setShowPoster(false)}
        >
          <Image
            src="/concert-banner.jpg"
            alt="Kirribilly concert poster"
            width={600}
            height={900}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', display: 'block' }}
          />
        </div>
      )}

      {/* Order summary bar (sticky) */}
      <OrderSummaryBar items={cart} onViewDetail={() => setShowDetailModal(true)} />

      {/* Order detail modal */}
      <OrderDetailModal items={cart} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />

      {/* Toast notification */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </main>
  )
}
