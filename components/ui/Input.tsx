'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="font-ui text-sm font-500 text-cream/70">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`
            bg-navy-muted border ${error ? 'border-red-500' : 'border-cream/20'}
            text-cream placeholder:text-cream/30
            px-4 py-3 text-sm font-ui
            focus:outline-none focus:border-gold
            transition-colors duration-150
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-ui">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
