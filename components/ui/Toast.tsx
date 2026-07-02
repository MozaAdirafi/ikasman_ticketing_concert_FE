'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'error' | 'success' | 'info'
  onDismiss: () => void
}

export function Toast({ message, type = 'error', onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const styles = {
    error: 'border-red-500/60 bg-red-950/80 text-red-200',
    success: 'border-gold/60 bg-navy-light text-gold',
    info: 'border-cream/20 bg-navy-muted text-cream',
  }

  return (
    <div
      className={`
        fixed bottom-6 left-4 right-4 z-50 border px-4 py-3
        font-ui text-sm ${styles[type]}
        animate-[fadeInUp_0.2s_ease-out]
      `}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <span>{message}</span>
        <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100 text-lg leading-none">
          ×
        </button>
      </div>
    </div>
  )
}
