'use client'

import { useRouter } from 'next/navigation'
import type { CartItem } from './MinimalTicketCard'

interface OrderSummaryBarProps {
  items: CartItem[]
  onViewDetail: () => void
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

export function OrderSummaryBar({ items, onViewDetail }: OrderSummaryBarProps) {
  const router = useRouter()

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.ticket.price * item.quantity, 0)
  const hasItems = totalQuantity > 0

  const handleOrderNow = () => {
    if (!hasItems) return

    // Store entire cart in localStorage
    localStorage.setItem('cartItems', JSON.stringify(items))

    // Navigate to registration
    router.push(`/register?step=confirm`)
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 border-t border-white/10
        transition-all duration-300 transform
        ${hasItems ? 'translate-y-0' : 'translate-y-full'}
        bg-gradient-to-t from-navy via-navy to-navy/95 backdrop-blur-sm
        z-40
      `}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {/* Left: Summary */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-ui mb-1">
              Subtotal ({totalQuantity} ticket{totalQuantity !== 1 ? 's' : ''})
            </p>
            <p className="font-display text-2xl md:text-3xl font-800 text-white">
              {formatPrice(totalPrice)}
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-4 ml-auto">
            <button
              onClick={onViewDetail}
              className="
                text-sm font-ui font-600 text-gray-300 hover:text-white
                transition-colors uppercase tracking-wide
                hidden md:block
              "
            >
              View Detail
            </button>

            <button
              onClick={handleOrderNow}
              disabled={!hasItems}
              className={`
                px-8 py-3 rounded font-display font-800 uppercase tracking-wider
                transition-all duration-200 text-sm md:text-base whitespace-nowrap
                ${
                  hasItems
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black hover:-translate-y-0.5'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
