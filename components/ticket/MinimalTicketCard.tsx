'use client'

import type { Ticket } from '@/types'

export interface CartItem {
  ticket: Ticket
  quantity: number
}

interface MinimalTicketCardProps {
  ticket: Ticket
  quantity: number
  onQuantityChange: (quantity: number) => void
}

const TIER_COLORS = {
  PLATINUM: { badge: '👑', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  GOLD: { badge: '⭐', color: 'text-amber-300', bg: 'bg-amber-500/10' },
  SILVER: { badge: '◆', color: 'text-slate-300', bg: 'bg-slate-500/10' },
  VIP: { badge: '♦', color: 'text-purple-300', bg: 'bg-purple-500/10' },
  REGULAR: { badge: '•', color: 'text-gray-300', bg: 'bg-gray-500/10' },
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
  const tierKey = (ticket.tier ?? 'REGULAR') as keyof typeof TIER_COLORS
  const tierConfig = TIER_COLORS[tierKey]
  const soldOut = ticket.stock === 0

  const quantities = Array.from({ length: Math.min(10, ticket.stock) }, (_, i) => i + 1)

  return (
    <div
      className="
        border border-white/10 rounded-lg p-6 backdrop-blur-sm
        transition-all duration-200 hover:border-white/20
        bg-gradient-to-br from-white/5 to-transparent
      "
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Info */}
        <div className="flex-1 min-w-0">
          {/* Tier badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-display font-700 uppercase tracking-wide ${tierConfig.bg} ${tierConfig.color}`}>
              <span>{tierConfig.badge}</span>
              {ticket.name}
            </span>
          </div>

          {/* Description */}
          {ticket.description && (
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              {ticket.description}
            </p>
          )}

          {/* Price + Availability */}
          <div className="flex items-baseline justify-between md:justify-start md:gap-4">
            <div>
              <span className="text-xs text-gray-400 font-ui uppercase tracking-wide">Price</span>
              <p className="font-display text-2xl font-800 text-white">
                {formatPrice(ticket.price)}
              </p>
            </div>

            {!soldOut && ticket.stock <= 5 && (
              <div className="text-xs text-orange-400 font-semibold uppercase tracking-wide">
                Only {ticket.stock} left
              </div>
            )}
          </div>
        </div>

        {/* Right: Quantity selector */}
        <div className="flex items-center gap-3 md:justify-end">
          {soldOut ? (
            <div className="text-xs text-red-400 font-semibold uppercase tracking-wide">
              Sold Out
            </div>
          ) : (
            <select
              value={quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              className="
                bg-navy-light border border-white/20 text-white
                px-4 py-2.5 rounded font-ui font-600 text-sm
                focus:outline-none focus:border-yellow-400
                transition-colors cursor-pointer appearance-none
                pr-8
              "
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23f3f4f6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                paddingRight: '32px',
              }}
            >
              <option value={0}>Select qty</option>
              {quantities.map((q) => (
                <option key={q} value={q}>
                  {q} ticket{q > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  )
}
