'use client'

import { Suspense } from 'react'
import { CheckoutContent } from './_checkout-content'

function CheckoutLoadingFallback() {
  return (
    <main className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center">
        <p className="text-cream/50 font-ui">Loading checkout...</p>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
