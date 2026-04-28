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
  title: 'Undangan Pernikahan Yudi & Kiki',
  description:
    'Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di pernikahan Yudi Maryadi & Aliza Rizky Shafara pada Jumat, 26 Juni 2026 di Sumbawa Besar, NTB.',
  openGraph: {
    title: 'Undangan Pernikahan Yudi & Kiki',
    description: 'Jumat, 26 Juni 2026 · Sumbawa Besar, NTB',
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
