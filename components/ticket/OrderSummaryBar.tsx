'use client'

import { useRouter } from 'next/navigation'
import { addServiceFee } from '@/lib/pricing'
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
  const subtotal = items.reduce((sum, item) => sum + item.ticket.price * item.quantity, 0)
  const totalWithFee = addServiceFee(subtotal)
  const hasItems = totalQuantity > 0

  const handleOrderNow = () => {
    if (!hasItems) return

    localStorage.setItem('cartItems', JSON.stringify(items))
    router.push('/register?step=confirm')
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 transition-all duration-300 transform z-40 ${hasItems ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ background: '#0a0e1a', borderTop: '1px solid #1e2640' }}
    >
      <div className="p-4 md:px-[60px] md:py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-6">
          <div>
            <p className="text-white text-[16px] font-600 md:text-xs md:text-gray-400 md:uppercase md:tracking-wide md:font-ui md:mb-1">
              <span className="md:hidden">{totalQuantity} tiket dipilih - Total: {formatPrice(totalWithFee)}</span>
              <span className="hidden md:inline">Total ({totalQuantity} tiket + biaya layanan)</span>
            </p>
            <p className="hidden md:block font-display text-3xl font-800 text-white leading-tight">
              {formatPrice(totalWithFee)}
            </p>
          </div>

          <div className="flex w-full md:w-auto items-center gap-3 md:gap-4 md:ml-auto">
            <button
              onClick={onViewDetail}
              className="text-sm font-ui font-600 text-gray-300 hover:text-white transition-colors uppercase tracking-wide hidden md:block"
            >
              Lihat Detail
            </button>

            <button
              onClick={handleOrderNow}
              disabled={!hasItems}
              className={`
                w-full md:w-auto rounded-md md:rounded px-4 md:px-8 h-[52px] md:h-auto md:py-3
                font-700 md:font-display md:font-800 md:uppercase md:tracking-wider
                transition-all duration-200 text-[16px] md:text-base whitespace-nowrap
                ${
                  hasItems
                    ? 'bg-[#FBBF24] md:bg-yellow-500 md:hover:bg-yellow-400 text-black md:hover:-translate-y-0.5'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span className="md:hidden">Lanjut ke Pembayaran</span>
              <span className="hidden md:inline">Pesan Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
