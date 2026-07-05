'use client'

import type { CheckinResponse } from '@/types'

interface ScanResultProps {
  result: CheckinResponse
}

function getTierBadge(ticketType: string) {
  const tier = ticketType.toUpperCase()

  if (tier.includes('PLATINUM')) {
    return {
      label: 'PLATINUM',
      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
    }
  }

  if (tier.includes('GOLD')) {
    return {
      label: 'GOLD',
      className: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    }
  }

  return {
    label: 'SILVER',
    className: 'bg-slate-400/20 text-slate-200 border-slate-300/40',
  }
}

export function ScanResult({ result }: ScanResultProps) {
  const isValid = result.valid
  const tier = getTierBadge(result.ticket_type || '')

  return (
    <div
      className={`
        w-full max-w-md border p-8 text-center rounded-lg
        ${isValid ? 'border-green-500/40 bg-green-950/20' : 'border-red-500/40 bg-red-950/20'}
      `}
    >
      <div
        className={`
          w-20 h-20 border-2 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl
          ${isValid ? 'border-green-500/60 text-green-400' : 'border-red-500/60 text-red-400'}
        `}
      >
        {isValid ? '✓' : '✕'}
      </div>

      {isValid ? (
        <>
          <h2 className="font-display text-3xl font-800 text-cream mb-2 leading-tight">
            {result.ticket_holder}
          </h2>
          <div className="mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-700 tracking-wide ${tier.className}`}>
              {tier.label}
            </span>
          </div>
          <p className="font-ui text-base text-green-300 mt-2">Selamat datang!</p>
        </>
      ) : (
        <>
          <h2 className="font-display text-2xl font-800 text-red-300 mb-2">Scan gagal</h2>
          <p className="font-ui text-base text-cream/80">{result.message}</p>
        </>
      )}
    </div>
  )
}
