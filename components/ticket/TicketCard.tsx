'use client'

import { useState } from 'react'
import type { Ticket } from '@/types'

interface TicketCardProps {
  ticket: Ticket
  onSelect: (ticket: Ticket, quantity: number) => void
}

const TIER_CONFIG = {
  PLATINUM: {
    color: '#FBBF24',
    label: 'PLATINUM',
    tagBg: 'bg-yellow-500/20 border-yellow-500/40',
    tagText: 'text-yellow-400',
    accentBg: 'from-yellow-500/20 to-transparent',
    badge: '👑',
  },
  GOLD: {
    color: '#FCD34D',
    label: 'GOLD',
    tagBg: 'bg-amber-500/20 border-amber-500/40',
    tagText: 'text-amber-300',
    accentBg: 'from-amber-500/20 to-transparent',
    badge: '⭐',
  },
  VIP: {
    color: '#E5E7EB',
    label: 'VIP',
    tagBg: 'bg-purple-500/20 border-purple-500/40',
    tagText: 'text-purple-300',
    accentBg: 'from-purple-500/20 to-transparent',
    badge: '♦',
  },
  SILVER: {
    color: '#D1D5DB',
    label: 'SILVER',
    tagBg: 'bg-slate-500/20 border-slate-500/40',
    tagText: 'text-slate-300',
    accentBg: 'from-slate-500/20 to-transparent',
    badge: '◆',
  },
  REGULAR: {
    color: '#9CA3AF',
    label: 'REGULAR',
    tagBg: 'bg-gray-500/20 border-gray-500/40',
    tagText: 'text-gray-300',
    accentBg: 'from-gray-500/20 to-transparent',
    badge: '•',
  },
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

export function TicketCard({ ticket, onSelect }: TicketCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const tierKey = (ticket.tier ?? 'REGULAR') as keyof typeof TIER_CONFIG
  const tier = TIER_CONFIG[tierKey]
  const soldOut = ticket.stock === 0

  const benefits = [
    'Priority entrance',
    'Premium seating',
    'Complimentary drink',
    'Exclusive merchandise',
  ]

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card container */}
      <div
        className={`
          relative overflow-hidden rounded-lg border transition-all duration-300
          ${soldOut ? 'opacity-60' : ''}
          ${isHovered && !soldOut ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'border-white/10'}
        `}
        style={{
          background: `linear-gradient(135deg, rgba(15,23,41,0.9), rgba(15,23,41,0.95))`,
          boxShadow: isHovered && !soldOut ? '0 0 20px rgba(251,191,36,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-8">
          {/* Left section: Ticket info */}
          <div className="flex-1 min-w-0">
            {/* Tier badge + availability */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border ${tier.tagBg}`}>
                <span className="text-lg">{tier.badge}</span>
                <span className={`font-display text-xs font-800 uppercase tracking-wider ${tier.tagText}`}>
                  {tier.label}
                </span>
              </div>
              {soldOut ? (
                <span className="text-xs font-600 text-red-400 uppercase tracking-wide border border-red-500/40 px-3 py-1.5 rounded">
                  Sold Out
                </span>
              ) : ticket.stock <= 5 ? (
                <span className="text-xs font-600 text-amber-400 uppercase tracking-wide">
                  Only {ticket.stock} left
                </span>
              ) : null}
            </div>

            {/* Ticket name */}
            <h3 className="font-display text-2xl md:text-3xl font-800 text-white mb-2 leading-tight">
              {ticket.name}
            </h3>

            {/* Event details */}
            <p className="text-sm text-gray-300 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Thursday, 30 July 2026 · 19.30 - 22.00 WIB
            </p>

            {/* Description */}
            {ticket.description && (
              <p className="text-sm text-gray-400 mb-4 leading-relaxed max-w-xl">
                {ticket.description}
              </p>
            )}

            {/* View Details link */}
            {!soldOut && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-yellow-400 hover:text-yellow-300 font-ui font-600 uppercase tracking-wide transition-colors"
              >
                {expanded ? '▼ Hide details' : '► View details'}
              </button>
            )}

            {/* Expandable details */}
            {expanded && !soldOut && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                <p className="text-xs font-600 text-gray-300 uppercase tracking-wide mb-2">What is included:</p>
                <ul className="space-y-1">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="text-yellow-400">✓</span> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right section: Price, quantity, actions (desktop) / stacked (mobile) */}
          <div className="flex flex-col md:flex-col md:items-end gap-6 w-full md:w-auto">
            {/* Price display */}
            <div className="flex flex-col md:text-right">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-ui mb-1">Price per ticket</span>
              <span className="font-display text-4xl font-900 text-yellow-400">
                {formatPrice(ticket.price)}
              </span>
            </div>

            {/* Quantity selector */}
            {!soldOut && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded px-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="py-2 px-3 text-gray-300 hover:text-yellow-400 transition-colors font-display font-bold"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="text-white font-display font-700 text-lg min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="py-2 px-3 text-gray-300 hover:text-yellow-400 transition-colors font-display font-bold"
                  disabled={quantity >= Math.min(10, ticket.stock)}
                >
                  +
                </button>
              </div>
            )}

            {/* Action buttons */}
            {!soldOut ? (
              <button
                onClick={() => onSelect(ticket, quantity)}
                className="
                  w-full md:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400
                  text-black font-display font-800 uppercase tracking-wider
                  rounded transition-all duration-200 shadow-lg hover:shadow-xl
                  hover:-translate-y-0.5
                "
              >
                Get {quantity > 1 ? `${quantity} Tickets` : 'Ticket'} →
              </button>
            ) : (
              <button
                disabled
                className="
                  w-full md:w-auto px-8 py-3 bg-gray-700 text-gray-400
                  font-display font-800 uppercase tracking-wider
                  rounded cursor-not-allowed
                "
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
