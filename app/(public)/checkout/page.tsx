'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePaymentStatus } from '@/hooks/usePaymentStatus'
import { Button } from '@/components/ui/Button'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { PaymentMethodBadge } from '@/components/checkout/PaymentMethodBadge'
import type { OrderResponse, PaymentMethod } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get('order_id')

  const [method, setMethod] = useState<PaymentMethod>('QRIS')
  const [order, setOrder] = useState<OrderResponse | undefined>()
  const [orderLoading, setOrderLoading] = useState(true)
  const { data: payment, isLoading: paymentLoading } = usePaymentStatus(orderId)

  // Load order from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('currentOrder')
    if (stored) {
      try {
        const data = JSON.parse(stored) as OrderResponse
        setOrder(data)
      } catch {
        console.error('Failed to parse order from localStorage')
      }
    }
    setOrderLoading(false)
  }, [])

  if (!orderId) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-cream/50 font-ui mb-4">No order found.</p>
          <Button variant="ghost" onClick={() => router.push('/')}>
            Back to tickets
          </Button>
        </div>
      </main>
    )
  }

  if (payment?.payment_status === 'paid') {
    return (
      <main className="min-h-screen bg-navy flex flex-col items-center justify-center px-5 animate-success-pulse">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 border-2 border-gold mx-auto mb-6 flex items-center justify-center">
            <span className="text-gold text-2xl">✓</span>
          </div>
          <h1 className="font-display text-2xl font-800 text-cream mb-3">
            You're in.
          </h1>
          <p className="text-cream/60 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
            Your e-ticket is on the way to your inbox.
            Check your email — and your spam folder just in case.
          </p>
          <p className="text-gold/60 text-xs mt-4 font-ui">Order #{orderId}</p>
        </div>
      </main>
    )
  }

  if (payment?.payment_status === 'failed') {
    return (
      <main className="min-h-screen bg-navy flex flex-col items-center justify-center px-5">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 border-2 border-red-500 mx-auto mb-6 flex items-center justify-center">
            <span className="text-red-400 text-2xl">✕</span>
          </div>
          <h1 className="font-display text-2xl font-800 text-cream mb-3">
            Payment failed.
          </h1>
          <p className="text-cream/60 text-sm mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Something went wrong with your payment. No charge was made.
          </p>
          <Button variant="ghost" onClick={() => router.push('/')}>
            Try again
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy flex flex-col">
      <header className="px-5 pt-10 pb-6 border-b border-cream/10">
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold mb-1">Step 2 of 2</p>
        <h1 className="font-display text-2xl font-800 text-cream">Pay & Confirm</h1>
        <p className="text-cream/50 text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>
          Complete payment to receive your e-ticket.
        </p>
      </header>

      <section className="flex-1 px-5 py-8 flex flex-col gap-6 max-w-lg mx-auto w-full">
        <OrderSummary order={order} loading={orderLoading} cartItems={JSON.parse(localStorage.getItem('orderCart') || '[]')} />

        <div>
          <p className="font-ui text-xs uppercase tracking-[0.15em] text-cream/40 mb-3">
            Payment Method
          </p>
          <div className="flex flex-col gap-2">
            {(['QRIS', 'VIRTUAL_ACCOUNT', 'EWALLET'] as PaymentMethod[]).map((m) => (
              <PaymentMethodBadge
                key={m}
                method={m}
                selected={method === m}
                onSelect={() => setMethod(m)}
              />
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-cream/10">
          {paymentLoading ? (
            <p className="text-cream/40 text-sm font-ui text-center py-4">
              Waiting for payment…
            </p>
          ) : (
            <p className="text-cream/50 text-sm text-center font-ui">
              Checking payment status automatically…
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
