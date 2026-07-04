'use client'

import { SERVICE_FEE } from '@/lib/pricing'
import type { CartItem } from './MinimalTicketCard'

interface OrderDetailModalProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
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

export function OrderDetailModal({ items, isOpen, onClose }: OrderDetailModalProps) {
  if (!isOpen) return null

  const subtotal = items.reduce((sum, item) => sum + item.ticket.price * item.quantity, 0)
  const total = subtotal + SERVICE_FEE

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        <div
          className="
            w-full md:max-w-md bg-navy border border-white/10 rounded-t-lg md:rounded-lg
            p-6 md:p-8 max-h-[90vh] md:max-h-auto overflow-y-auto
            animate-[slideUp_0.3s_ease-out]
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-800 text-white">Detail Pesanan</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
            {items.map((item) => (
              <div key={item.ticket.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-display font-700 text-white">
                      {item.ticket.name} <span className="text-gray-400">×{item.quantity}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatPrice(item.ticket.price)} per tiket
                    </p>
                  </div>
                  <p className="font-display font-800 text-yellow-400">
                    {formatPrice(item.ticket.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Biaya Layanan</span>
              <span>{formatPrice(SERVICE_FEE)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-display font-700 text-gray-300">Total</span>
            <span className="font-display text-3xl font-900 text-yellow-400">
              {formatPrice(total)}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="
              w-full mt-6 px-6 py-3 bg-white/10 hover:bg-white/20
              text-white font-display font-700 uppercase tracking-wider
              rounded transition-colors
            "
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  )
}
