'use client'

import type { Ticket } from '@/types'

type TierConfig = {
  borderColor: string
  badgeBg: string
  badgeColor: string
  badgeBorder: string
  dropdownBorderColor: string
}

function getTierConfig(tier: string): TierConfig {
  switch (tier.toUpperCase()) {
    case 'PLATINUM':
      return {
        borderColor: '#FBBF24',
        badgeBg: 'rgba(251,191,36,0.15)',
        badgeColor: '#FBBF24',
        badgeBorder: '1px solid rgba(251,191,36,0.3)',
        dropdownBorderColor: '#FBBF24',
      }
    case 'GOLD':
      return {
        borderColor: '#F97316',
        badgeBg: 'rgba(249,115,22,0.15)',
        badgeColor: '#F97316',
        badgeBorder: '1px solid rgba(249,115,22,0.3)',
        dropdownBorderColor: '#F97316',
      }
    case 'SILVER':
      return {
        borderColor: '#94A3B8',
        badgeBg: 'rgba(148,163,184,0.15)',
        badgeColor: '#94A3B8',
        badgeBorder: '1px solid rgba(148,163,184,0.3)',
        dropdownBorderColor: '#94A3B8',
      }
    default:
      return {
        borderColor: '#334155',
        badgeBg: 'rgba(51,65,85,0.15)',
        badgeColor: '#94A3B8',
        badgeBorder: '1px solid rgba(51,65,85,0.3)',
        dropdownBorderColor: '#475569',
      }
  }
}

export interface CartItem {
  ticket: Ticket
  quantity: number
}

interface MinimalTicketCardProps {
  ticket: Ticket
  quantity: number
  onQuantityChange: (quantity: number) => void
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

export function MinimalTicketCard({ ticket, quantity, onQuantityChange }: MinimalTicketCardProps) {
  const tier = ticket.tier ?? 'REGULAR'
  const config = getTierConfig(tier)
  const soldOut = ticket.stock === 0
  const quantities = Array.from({ length: Math.min(10, ticket.stock) }, (_, i) => i + 1)

  return (
    <div
      className="w-full rounded-lg border border-white/10 bg-[#131929] hover:bg-[#1a2235] transition-colors duration-200 border-l-4 md:border-l-[3px]"
      style={{ borderLeftColor: config.borderColor, minHeight: '90px' }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: '90px' }}>
        <div className="flex-1 px-4 py-5 md:px-6 md:py-6 flex flex-col justify-center gap-2">
          <span
            className="text-[13px] md:text-[12px] font-bold uppercase w-fit rounded"
            style={{
              letterSpacing: '0.08em',
              background: config.badgeBg,
              color: config.badgeColor,
              border: config.badgeBorder,
              padding: '3px 10px',
            }}
          >
            {ticket.name.toUpperCase()}
          </span>
          <p className="text-white font-800 leading-tight text-[26px]">
            {formatPrice(ticket.price)}
          </p>
        </div>

        <div
          className="mx-3 md:mx-6"
          style={{
            position: 'relative',
            width: '0',
            borderLeft: '2px dashed rgba(255,255,255,0.12)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-1px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '8px',
              borderRadius: '0 0 8px 8px',
              background: '#0F1729',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-1px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '8px',
              borderRadius: '8px 8px 0 0',
              background: '#0F1729',
              zIndex: 2,
            }}
          />
        </div>

        <div className="w-[132px] md:w-[160px] pr-4 py-5 md:pr-6 md:py-6 flex items-center justify-center">
          <select
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            disabled={soldOut}
            className="text-white text-[13px] md:text-[15px] font-medium rounded focus:outline-none transition-colors cursor-pointer appearance-none disabled:opacity-60 disabled:cursor-not-allowed h-12"
            style={{
              background: '#162236',
              border: `1px solid ${config.dropdownBorderColor}`,
              padding: '7px 28px 7px 10px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23f3f4f6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              width: '100%',
            }}
          >
            <option value={0}>{soldOut ? 'Habis' : 'Pilih Jumlah'}</option>
            {!soldOut && quantities.map((q) => (
              <option key={q} value={q}>{q} tiket</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
