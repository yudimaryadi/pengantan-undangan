'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Download, CheckCircle } from 'lucide-react'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
import QRCode from 'qrcode'

interface PhotoboxTicketSectionProps {
  guestName?: string
  isVisible?: boolean
}

export function PhotoboxTicketSection({ guestName = 'Tamu Undangan', isVisible = false }: PhotoboxTicketSectionProps) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [downloaded, setDownloaded] = useState(false)

  // Generate QR code from guest name + timestamp
  useEffect(() => {
    const ticketData = JSON.stringify({
      guest: guestName,
      event: 'Wedding Photobox',
      timestamp: Date.now(),
      valid: true,
    })

    QRCode.toDataURL(ticketData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#C4788A',  // rose pink
        light: '#FFFFFF',
      },
    }).then(setQrDataUrl).catch(() => {})
  }, [guestName])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `photobox-ticket-${guestName.replace(/\s+/g, '-')}.png`
    link.click()
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  return (
    <section className="relative py-24 px-6 bg-w-bgAlt overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <FloralCorner position="bottom-left" size="sm" />
      <FloralCorner position="bottom-right" size="sm" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-w-rose-pale/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">
            Hadiah Spesial
          </p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide mb-2">
            Tiket Photobox Gratis
          </h2>
          <FloralDivider variant="rose" className="mt-4 mb-0" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white border border-w-border p-8 shadow-card mb-6"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-w-rose-pale flex items-center justify-center">
              <Camera className="w-8 h-8 text-w-rose" />
            </div>
          </div>

          <p className="text-w-body font-poppins font-light text-sm leading-relaxed mb-6">
            Sebagai tanda terima kasih, kami memberikan <strong className="text-w-rose font-medium">1 sesi photobox gratis</strong> untuk Anda!
          </p>

          {/* QR Code */}
          {qrDataUrl && (
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white border-2 border-w-rose/20 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR Code Tiket Photobox" className="w-48 h-48" />
              </div>
            </div>
          )}

          {/* Guest name */}
          <div className="mb-6 pb-4 border-b border-w-line">
            <p className="text-w-subtle font-poppins font-light text-xs tracking-[0.2em] uppercase mb-1">
              Atas Nama
            </p>
            <p className="text-w-ink font-poppins font-medium text-lg">
              {guestName}
            </p>
          </div>

          {/* Instructions */}
          <div className="text-left space-y-2 mb-6">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-w-rose mt-0.5 flex-shrink-0" />
              <p className="text-w-body font-poppins font-light text-xs">
                Tunjukkan QR code ini di booth photobox
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-w-rose mt-0.5 flex-shrink-0" />
              <p className="text-w-body font-poppins font-light text-xs">
                Berlaku untuk 1 sesi (4 foto)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-w-rose mt-0.5 flex-shrink-0" />
              <p className="text-w-body font-poppins font-light text-xs">
                Simpan atau screenshot tiket ini
              </p>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            aria-label="Download tiket photobox"
            className="
              flex items-center justify-center gap-2
              w-full min-h-[48px] px-6 py-3
              bg-w-rose text-white
              font-poppins font-medium text-xs tracking-[0.2em] uppercase
              shadow-rose
              hover:bg-w-mauve
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-w-rose focus:ring-offset-2
            "
          >
            <Download className="w-4 h-4" />
            {downloaded ? 'Tersimpan!' : 'Download Tiket'}
          </button>
        </motion.div>

        <p className="text-w-subtle font-poppins font-light text-xs italic">
          * Tiket berlaku di hari acara resepsi
        </p>
      </div>
    </section>
  )
}
