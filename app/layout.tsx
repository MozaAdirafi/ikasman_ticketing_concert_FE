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
  title: 'Harmoni Untuk Negeri | Tiket Konser',
  description:
    'Kirribilly Beatles Tribute Band Indonesia hadir dalam konser spesial Harmoni Untuk Negeri. Feat. Cakra Khan & Astrid. 30 Juli 2026, Deheng House Jakarta Selatan.',
  openGraph: {
    title: 'Harmoni Untuk Negeri',
    description:
      'Konser spesial feat. Cakra Khan & Astrid. Kamis, 30 Juli 2026 · Deheng House, Jakarta Selatan',
    images: [
      {
        url: 'https://ikasman37event.com/concert-banner.jpg',
        width: 3696,
        height: 1848,
        alt: 'Harmoni Untuk Negeri Concert Banner',
      },
    ],
    url: 'https://ikasman37event.com',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harmoni Untuk Negeri',
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
