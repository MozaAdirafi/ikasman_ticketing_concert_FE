'use client'

import { useState, useEffect } from 'react'
import { useCheckin } from '@/hooks/useCheckin'
import { QRScanner } from '@/components/checkin/QRScanner'
import { ScanResult } from '@/components/checkin/ScanResult'
import type { CheckinResponse } from '@/types'

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? ''

export default function CheckinPage() {
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pinError, setPinError] = useState(false)
  const [result, setResult] = useState<CheckinResponse | null>(null)

  const { mutate: checkin, isPending } = useCheckin()

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      setAuthenticated(true)
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 2000)
    }
  }

  function handleScan(qrCode: string) {
    if (isPending || result) return
    checkin(
      { qr_code: qrCode },
      {
        onSuccess: (data) => {
          setResult(data)
          setTimeout(() => setResult(null), 3000)
        },
        onError: (err) => {
          setResult({ valid: false, ticket_holder: '', ticket_type: '', message: err.message })
          setTimeout(() => setResult(null), 3000)
        },
      }
    )
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center px-5">
        <form onSubmit={handlePinSubmit} className="w-full max-w-xs flex flex-col gap-4">
          <h1 className="font-display text-xl font-800 text-cream text-center mb-2">
            Admin Access
          </h1>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className={`
              bg-navy-muted border ${pinError ? 'border-red-500' : 'border-cream/20'}
              text-cream text-center text-2xl tracking-[0.5em] px-4 py-3
              focus:outline-none focus:border-gold transition-colors
            `}
            maxLength={8}
          />
          {pinError && (
            <p className="text-red-400 text-sm text-center font-ui">Incorrect PIN</p>
          )}
          <button
            type="submit"
            className="bg-gold text-navy font-display font-700 uppercase tracking-wider py-3"
          >
            Unlock →
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy flex flex-col">
      <header className="px-5 pt-8 pb-5 border-b border-cream/10">
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold mb-1">Admin</p>
        <h1 className="font-display text-xl font-800 text-cream">Scan Tickets</h1>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        {result ? (
          <ScanResult result={result} />
        ) : (
          <QRScanner onScan={handleScan} scanning={isPending} />
        )}
      </section>
    </main>
  )
}
