'use client'

import type { CheckinResponse } from '@/types'

interface ScanResultProps {
  result: CheckinResponse
}

export function ScanResult({ result }: ScanResultProps) {
  const isValid = result.valid

  return (
    <div
      className={`
        w-full max-w-xs border-2 p-8 text-center
        ${isValid ? 'border-gold bg-gold/5' : 'border-red-500 bg-red-950/20'}
      `}
    >
      <div
        className={`
          w-14 h-14 border-2 mx-auto mb-5 flex items-center justify-center text-2xl
          ${isValid ? 'border-gold text-gold' : 'border-red-500 text-red-400'}
        `}
      >
        {isValid ? '✓' : '✕'}
      </div>

      {isValid ? (
        <>
          <h2 className="font-display text-lg font-800 text-cream mb-1">
            {result.ticket_holder}
          </h2>
          <p className="font-ui text-sm text-gold">{result.ticket_type}</p>
          <p className="font-ui text-xs text-cream/40 mt-3">Welcome in.</p>
        </>
      ) : (
        <>
          <h2 className="font-display text-lg font-800 text-red-300 mb-1">Invalid Ticket</h2>
          <p className="font-ui text-sm text-cream/60">{result.message}</p>
        </>
      )}
    </div>
  )
}
