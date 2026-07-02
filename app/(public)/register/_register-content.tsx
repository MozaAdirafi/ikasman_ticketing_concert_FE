'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registrationSchema, type RegistrationFormValues } from '@/lib/validations'
import { useCreateOrder } from '@/hooks/useCreateOrder'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import type { CartItem } from '@/components/ticket/MinimalTicketCard'

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

export function RegisterContent() {
  const router = useRouter()
  const params = useSearchParams()
  const ticketId = params.get('ticket_id') ?? ''
  const qty = Number(params.get('qty') ?? 1)

  const [toast, setToast] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cartItems')
    if (stored) {
      try {
        const items = JSON.parse(stored) as CartItem[]
        setCartItems(items)
      } catch {
        console.error('Failed to parse cart')
      }
    }
  }, [])

  const { mutate: createOrder, isPending } = useCreateOrder()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
  })

  // Calculate totals
  const totalTickets = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.ticket.price * item.quantity, 0)

  function onSubmit(values: RegistrationFormValues) {
    // Send all cart items to backend
    const payload = {
      ...values,
      items: cartItems.map((item) => ({
        ticket_id: item.ticket.id,
        quantity: item.quantity,
      })),
    }

    createOrder(payload as any, {
      onSuccess: (order) => {
        // Store cart and order details in localStorage for after payment
        localStorage.setItem('currentOrder', JSON.stringify(order))
        localStorage.setItem('orderCart', JSON.stringify(cartItems))

        // Redirect to Midtrans SNAP payment page
        if (order.payment_url) {
          window.location.href = order.payment_url
        } else {
          // Fallback if payment_url is missing
          setToast('Payment URL not received. Please try again.')
        }
      },
      onError: (err) => {
        setToast(err.message)
      },
    })
  }

  return (
    <main className="min-h-screen bg-navy flex flex-col">
      <header className="px-5 md:px-6 pt-10 pb-6 border-b border-cream/10">
        <button
          onClick={() => router.back()}
          className="font-ui text-xs text-cream/40 hover:text-gold transition-colors mb-4 block"
        >
          ← Back
        </button>
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold mb-1">Step 1 of 2</p>
        <h1 className="font-display text-3xl font-800 text-cream">Your Details</h1>
        <p className="text-cream/50 text-sm mt-2" style={{ fontFamily: 'Georgia, serif' }}>
          We'll send your e-tickets to the email below.
        </p>
      </header>

      <section className="flex-1 px-5 md:px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Order Summary Card */}
        {cartItems.length > 0 && (
          <div className="mb-8 border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent rounded-lg p-6">
            <p className="font-ui text-xs uppercase tracking-[0.15em] text-gold mb-4">
              Order Summary
            </p>
            <div className="space-y-3 mb-4 pb-4 border-b border-gold/20">
              {cartItems.map((item) => (
                <div key={item.ticket.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-display font-700 text-cream">
                      {item.ticket.name} <span className="text-cream/60">×{item.quantity}</span>
                    </p>
                    <p className="text-xs text-cream/50 mt-1">
                      {formatPrice(item.ticket.price)} each
                    </p>
                  </div>
                  <p className="font-display font-800 text-gold">
                    {formatPrice(item.ticket.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-display font-700 text-cream/70">Total ({totalTickets} tickets)</span>
              <span className="font-display text-2xl font-900 text-gold">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          <Input
            label="Full Name"
            placeholder="As written on your ID"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="WhatsApp Number"
            type="tel"
            placeholder="081234567890"
            error={errors.whatsapp?.message}
            {...register('whatsapp')}
          />

          <Button type="submit" size="lg" loading={isPending} className="mt-4">
            Continue to Payment
          </Button>
        </form>
      </section>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </main>
  )
}
