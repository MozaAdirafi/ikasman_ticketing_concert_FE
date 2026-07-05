'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePaymentStatus } from '@/hooks/usePaymentStatus'
import { Button } from '@/components/ui/Button'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import type { OrderResponse } from '@/types'

export function CheckoutContent() {
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get('order_id')
  const transactionStatus = params.get('transaction_status')
  const statusCode = params.get('status_code')
  const redirectStatus = params.get('status')

  const normalizedTransactionStatus = (transactionStatus ?? '').toLowerCase()
  const isFailedByTransactionStatus = ['cancel', 'deny', 'expire'].includes(normalizedTransactionStatus)
  const isFailedByRedirectStatus = redirectStatus === 'error' || redirectStatus === 'unfinish'
  const isNon200StatusCode = statusCode !== null && statusCode !== '200'

  const forceFailedScreen =
    isFailedByTransactionStatus ||
    isFailedByRedirectStatus ||
    isNon200StatusCode

  const shouldPollFromUrl =
    transactionStatus === null ||
    ((normalizedTransactionStatus === 'settlement' || normalizedTransactionStatus === 'capture') &&
      statusCode === '200')

  const shouldPoll = !forceFailedScreen && shouldPollFromUrl

  const [order] = useState<OrderResponse | undefined>(() => {
    if (typeof window === 'undefined') return undefined

    const stored = localStorage.getItem('currentOrder')
    if (!stored) return undefined

    try {
      return JSON.parse(stored) as OrderResponse
    } catch {
      console.error('Gagal membaca data pesanan dari localStorage')
      return undefined
    }
  })

  const { data: payment, isLoading: paymentLoading } = usePaymentStatus(shouldPoll ? orderId : null)

  if (payment?.payment_status === 'paid') {
    return (
      <main className="min-h-screen bg-navy flex flex-col items-center justify-center px-5 animate-success-pulse">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 border-2 border-gold mx-auto mb-6 flex items-center justify-center">
            <span className="text-gold text-2xl">OK</span>
          </div>
          <h1 className="font-display text-2xl font-800 text-cream mb-3">
            Pembayaran berhasil.
          </h1>
          <p className="text-cream/60 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
            E-tiket sedang dikirim ke email Anda.
            Cek inbox dan folder spam bila belum masuk.
          </p>
          <p className="text-gold/60 text-xs mt-4 font-ui">Pesanan #{orderId}</p>
          <Button variant="ghost" onClick={() => router.push('/')} className="mt-6">
            Pesan Lagi
          </Button>
        </div>
      </main>
    )
  }

  if (forceFailedScreen || payment?.payment_status === 'failed') {
    return (
      <main className="min-h-screen bg-navy flex flex-col items-center justify-center px-5">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 border-2 border-red-500 mx-auto mb-6 flex items-center justify-center">
            <span className="text-red-400 text-2xl">X</span>
          </div>
          <h1 className="font-display text-2xl font-800 text-red-400 mb-3">
            Pembayaran Gagal
          </h1>
          <p className="text-cream/60 text-sm mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Transaksi dibatalkan atau gagal diproses.
          </p>
          <Button variant="ghost" onClick={() => router.push('/')}>
            Coba Lagi
          </Button>
        </div>
      </main>
    )
  }

  if (!orderId) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-cream/50 font-ui mb-4">Pesanan tidak ditemukan.</p>
          <Button variant="ghost" onClick={() => router.push('/')}>
            Kembali ke beranda
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy flex flex-col">
      <header className="px-5 md:px-6 pt-10 pb-6 border-b border-cream/10">
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold mb-1">Langkah 2 dari 2</p>
        <h1 className="font-display text-2xl font-800 text-cream">Checkout</h1>
        <p className="text-cream/50 text-sm mt-2" style={{ fontFamily: 'Georgia, serif' }}>
          Selesaikan pembayaran untuk menerima e-tiket Anda.
        </p>
      </header>

      <section className="flex-1 px-5 md:px-6 py-8 flex flex-col gap-6 max-w-lg mx-auto w-full">
        <OrderSummary order={order} loading={false} />

        <div className="pt-2 border-t border-cream/10">
          {paymentLoading ? (
            <p className="text-cream/40 text-sm font-ui text-center py-4">
              Memeriksa status pembayaran...
            </p>
          ) : (
            <p className="text-cream/50 text-sm text-center font-ui">
              Status pembayaran dicek otomatis. Setelah bayar via Midtrans Snap, halaman ini akan ter-update.
            </p>
          )}
        </div>

        <Button variant="ghost" onClick={() => router.push('/')}>
          Pesan Tiket Lain
        </Button>
      </section>
    </main>
  )
}
