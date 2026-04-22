import type { Metadata } from 'next'
import { Poppins, Amiri } from 'next/font/google'
import './globals.css'

// Requirements: 13.3

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Undangan Pernikahan Arif & Nisa',
  description:
    'Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di pernikahan Muhammad Arif Hidayat & Siti Nurhaliza Putri pada Sabtu, 12 Juli 2025 di Sumbawa Besar, NTB.',
  openGraph: {
    title: 'Undangan Pernikahan Arif & Nisa',
    description: 'Sabtu, 12 Juli 2025 · Sumbawa Besar, NTB',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${amiri.variable}`}>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
