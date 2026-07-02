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
  title: 'Kirribilly Concert — Get Your Ticket',
  description: 'Secure your spot at the biggest concert of the year.',
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
