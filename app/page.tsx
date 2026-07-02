'use client'

import { useState } from 'react'
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
      <section className="px-5 md:px-6 pt-12 md:pt-16 pb-10 text-center border-b border-white/10">
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-yellow-400 mb-3">
          Live Concert
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-900 text-white leading-[1.1] tracking-tight mb-2">
          Kirribilly
          <br />
          <span className="text-yellow-400">Concert 2025</span>
        </h1>
        <p className="mt-6 text-gray-300 text-base md:text-lg" style={{ fontFamily: 'Georgia, serif' }}>
          Saturday, 15 March 2025 · Jakarta Convention Center
        </p>
        <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: 'Georgia, serif' }}>
          Gates open 18.00 · Show starts 19.00 WIB
        </p>
      </section>

      {/* Tickets section */}
      <section className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="font-display text-3xl font-800 text-white mb-2">Select Your Tickets</h2>
          <p className="text-gray-400 text-base">Choose your preferred seating and quantity</p>
        </div>

        {/* Tickets list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white/5 border border-white/10 rounded animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="border border-red-500/30 bg-red-950/20 rounded-lg p-8 text-center">
            <p className="text-red-400 font-ui">Could not load tickets. Please refresh.</p>
          </div>
        ) : tickets && tickets.length > 0 ? (
          <div className="space-y-4">
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
            <p className="text-gray-400 font-ui">No tickets available</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-8 border-t border-white/10 text-center py-6">
        <p className="text-gray-400 text-xs font-ui">
          Powered by DOKU · 100% Secure Ticketing
        </p>
      </footer>

      {/* Order summary bar (sticky) */}
      <OrderSummaryBar items={cart} onViewDetail={() => setShowDetailModal(true)} />

      {/* Order detail modal */}
      <OrderDetailModal items={cart} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />

      {/* Toast notification */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </main>
  )
}
