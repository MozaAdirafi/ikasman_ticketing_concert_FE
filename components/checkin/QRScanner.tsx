'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserQRCodeReader } from '@zxing/browser'

interface QRScannerProps {
  onScan: (code: string) => void
  scanning: boolean
}

export function QRScanner({ onScan, scanning }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserQRCodeReader | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const reader = new BrowserQRCodeReader()
    readerRef.current = reader

    let controls: { stop: () => void } | null = null

    if (videoRef.current) {
      reader
        .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
          if (result && !scanning) {
            onScan(result.getText())
          }
        })
        .then((ctrl) => {
          controls = ctrl
        })
        .catch(() => {
          setError('Camera access denied. Please allow camera permission.')
        })
    }

    return () => {
      controls?.stop()
    }
  }, [onScan, scanning])

  if (error) {
    return (
      <div className="text-center max-w-xs">
        <p className="text-red-400 text-sm font-ui">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs">
      <div className="relative border-2 border-gold/40 aspect-square overflow-hidden bg-black">
        <video ref={videoRef} className="w-full h-full object-cover" />

        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-gold/60 animate-scanline" />
        </div>

        {/* Corner marks */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-5 h-5 border-gold border-2`}
            style={{
              borderRight: pos.includes('right') ? undefined : 'none',
              borderLeft: pos.includes('left') ? undefined : 'none',
              borderBottom: pos.includes('bottom') ? undefined : 'none',
              borderTop: pos.includes('top') ? undefined : 'none',
            }}
          />
        ))}
      </div>

      <p className="text-center text-cream/40 text-xs font-ui mt-4">
        {scanning ? 'Processing…' : 'Align QR code within the frame'}
      </p>
    </div>
  )
}
