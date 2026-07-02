'use client'

import { Suspense } from 'react'
import { RegisterContent } from './_register-content'

function RegisterLoadingFallback() {
  return (
    <main className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center">
        <p className="text-cream/50 font-ui">Loading registration...</p>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoadingFallback />}>
      <RegisterContent />
    </Suspense>
  )
}
