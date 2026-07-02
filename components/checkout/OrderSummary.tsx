'use client'

import type { OrderResponse } from '@/types'
import type { CartItem } from '@/components/ticket/MinimalTicketCard'

interface OrderSummaryProps {
  order?: OrderResponse
  loading?: boolean
  cartItems?: CartItem[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace('IDR', 'Rp')
    .trim()
}

export function OrderSummary({ order, loading, cartItems = [] }: OrderSummaryProps) {
  if (loading) {
    return (
      <div className="border border-cream/10 bg-navy-light p-5 animate-pulse">
        <p className="font-ui text-xs uppercase tracking-[0.15em] text-cream/40 mb-3">
          Order Summary
        </p>
        <div className="space-y-2">
          <div className="h-4 bg-navy rounded w-24" />
          <div className="h-4 bg-navy rounded w-32" />
        </div>
      </div>
    )
  }

  // Show cart items if available
  if (cartItems && cartItems.length > 0) {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.ticket.price * item.quantity, 0)
    return (
      <div className="border border-cream/10 bg-navy-light p-5">
        <p className="font-ui text-xs uppercase tracking-[0.15em] text-cream/40 mb-4">
          Order Summary
        </p>
        <div className="space-y-3 mb-4 pb-4 border-b border-cream/10">
          {cartItems.map((item) => (
            <div key={item.ticket.id} className="flex justify-between items-start">
              <div>
                <p className="font-ui text-sm text-cream/70">
                  {item.ticket.name} <span className="text-cream/50">×{item.quantity}</span>
                </p>
                <p className="text-xs text-cream/50 mt-0.5">
                  {formatPrice(item.ticket.price)} each
                </p>
              </div>
              <p className="font-display font-700 text-gold">
                {formatPrice(item.ticket.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-ui text-sm text-cream/70">Total</span>
          <span className="font-display text-xl font-900 text-gold">
            {formatPrice(cartTotal)}
          </span>
        </div>
      </div>
    )
  }

  // Fallback to order data if no cart
  if (order) {
    return (
      <div className="border border-cream/10 bg-navy-light p-5">
        <p className="font-ui text-xs uppercase tracking-[0.15em] text-cream/40 mb-3">
          Order Summary
        </p>
        {order.ticket ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="font-ui text-sm text-cream/70">
                {order.quantity}× {order.ticket?.name ?? 'Ticket'}
              </span>
              <span className="font-display text-sm font-700 text-cream">
                {order.ticket?.price ? formatPrice(order.ticket.price * order.quantity) : '—'}
              </span>
            </div>
            <div className="border-t border-cream/10 pt-3 mt-3 flex justify-between items-center">
              <span className="font-ui text-sm text-cream/70">Total</span>
              <span className="font-display text-xl font-900 text-gold">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </>
        ) : (
          <p className="text-cream/40 text-sm font-ui">No order data</p>
        )}
      </div>
    )
  }

  return (
    <div className="border border-cream/10 bg-navy-light p-5">
      <p className="text-cream/40 text-sm font-ui">No order data</p>
    </div>
  )
}
