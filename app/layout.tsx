import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Providers } from '@/app/providers'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kirribilly Road to Liverpool | Tiket Konser',
  description:
    'Kirribilly Beatles Tribute Band Indonesia hadir dalam konser spesial Road to Liverpool. Feat. Cakra Khan & Astrid. 30 Juli 2026, Deheng House Jakarta Selatan.',
  openGraph: {
    title: 'Kirribilly - Road to Liverpool',
    description:
      'Konser spesial feat. Cakra Khan & Astrid. Kamis, 30 Juli 2026 · Deheng House, Jakarta Selatan',
    images: [
      {
        url: 'https://ikasman37event.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kirribilly Road to Liverpool Concert Banner',
      },
    ],
    url: 'https://ikasman37event.com',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kirribilly - Road to Liverpool',
    description: 'Konser spesial feat. Cakra Khan & Astrid. 30 Juli 2026',
    images: ['https://ikasman37event.com/concert-banner.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-navy text-cream antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
