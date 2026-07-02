'use client'

import type { PaymentMethod } from '@/types'

const METHOD_LABELS: Record<PaymentMethod, { label: string; sub: string }> = {
  QRIS: { label: 'QRIS', sub: 'Scan with any e-wallet app' },
  VIRTUAL_ACCOUNT: { label: 'Virtual Account', sub: 'BCA · BNI · Mandiri · BRI' },
  EWALLET: { label: 'E-Wallet', sub: 'GoPay · OVO · Dana · LinkAja' },
}

interface PaymentMethodBadgeProps {
  method: PaymentMethod
  selected: boolean
  onSelect: () => void
}

export function PaymentMethodBadge({ method, selected, onSelect }: PaymentMethodBadgeProps) {
  const { label, sub } = METHOD_LABELS[method]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full flex items-center gap-4 px-4 py-3 border text-left
        transition-colors duration-150
        ${selected
          ? 'border-gold bg-gold/5 text-cream'
          : 'border-cream/15 bg-navy-light text-cream/60 hover:border-cream/30'
        }
      `}
    >
      <div
        className={`
          w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
          ${selected ? 'border-gold' : 'border-cream/30'}
        `}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-gold" />}
      </div>
      <div>
        <p className={`font-display text-sm font-700 ${selected ? 'text-cream' : 'text-cream/70'}`}>
          {label}
        </p>
        <p className="font-ui text-xs text-cream/40 mt-0.5">{sub}</p>
      </div>
    </button>
  )
}
