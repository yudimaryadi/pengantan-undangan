import type { Metadata } from 'next'
import { Poppins, Amiri, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

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

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Undangan Pernikahan Mace & Anne',
  description:
    'Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di pernikahan Muhammad Mace Hidayat & Siti Nurhaliza Putri pada Sabtu, 12 Juli 2025 di Sumbawa Besar, NTB.',
  openGraph: {
    title: 'Undangan Pernikahan Mace & Anne',
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
    <html lang="id" className={`${poppins.variable} ${amiri.variable} ${cormorant.variable}`}>
      <body className="antialiased overflow-x-hidden grain">
        {children}
      </body>
    </html>
  )
}
