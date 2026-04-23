'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FloralCorner } from './ui/FloralCorner'

interface CoverScreenProps {
  groomName: string
  brideName: string
  couplePhoto: string
  isVisible: boolean
  guestName?: string
  onOpenClick: () => void
}

export function CoverScreen({
  groomName, brideName, couplePhoto, isVisible, guestName, onOpenClick,
}: CoverScreenProps) {
  const [photoError, setPhotoError] = useState(false)
  if (!isVisible) return null

  const groomInitial = groomName.charAt(0).toUpperCase()
  const brideInitial = brideName.charAt(0).toUpperCase()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-w-bg">

      {/* Floral corner decorations */}
      <FloralCorner position="top-left" size="lg" />
      <FloralCorner position="top-right" size="lg" />
      <FloralCorner position="bottom-left" size="md" />
      <FloralCorner position="bottom-right" size="md" />

      {/* Background photo */}
      <div className="absolute inset-0">
        {!photoError ? (
          <Image src={couplePhoto} alt={`Foto ${groomName} & ${brideName}`}
            fill className="object-cover scale-105" priority onError={() => setPhotoError(true)} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-w-bg via-w-overlay to-w-bgAlt flex items-center justify-center">
            <span className="text-w-rose/20 text-9xl font-cormorant font-light">
              {groomInitial}&amp;{brideInitial}
            </span>
          </div>
        )}
        {/* Soft overlay — keeps photo visible but adds warmth */}
        <div className="absolute inset-0 bg-gradient-to-b from-w-bg/60 via-w-bg/30 to-w-bg/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-w-bg/30 via-transparent to-w-bg/30" />
      </div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1' fill='%23C4788A'/%3E%3C/svg%3E")`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center max-w-lg mx-auto w-full">

        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-6"
        >
          The Wedding of
        </motion.p>

        {/* Top ornament line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="flex items-center gap-3 mb-6 w-full max-w-xs"
        >
          <div className="flex-1 h-px bg-w-border" />
          <div className="w-1.5 h-1.5 rotate-45 bg-w-rose/50" />
          <div className="flex-1 h-px bg-w-border" />
        </motion.div>

        {/* Bismillah */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-w-gold font-amiri text-xl mb-7"
          dir="rtl" lang="ar"
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </motion.p>

        {/* Groom name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="font-cormorant font-light text-w-ink text-4xl sm:text-5xl md:text-6xl leading-none tracking-wide"
        >
          {groomName}
        </motion.h1>

        {/* Ampersand with mini flowers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="my-3 flex items-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {[0, 72, 144, 216, 288].map((a) => {
              const r = (a * Math.PI) / 180
              return <ellipse key={a} cx={10 + Math.cos(r) * 5} cy={10 + Math.sin(r) * 5}
                rx="3" ry="4.5" transform={`rotate(${a}, ${10 + Math.cos(r) * 5}, ${10 + Math.sin(r) * 5})`}
                fill="#D9A0AE" fillOpacity="0.6" />
            })}
            <circle cx="10" cy="10" r="2" fill="#C4788A" fillOpacity="0.7" />
          </svg>
          <span className="text-w-rose font-cormorant text-3xl italic">&amp;</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {[0, 72, 144, 216, 288].map((a) => {
              const r = (a * Math.PI) / 180
              return <ellipse key={a} cx={10 + Math.cos(r) * 5} cy={10 + Math.sin(r) * 5}
                rx="3" ry="4.5" transform={`rotate(${a}, ${10 + Math.cos(r) * 5}, ${10 + Math.sin(r) * 5})`}
                fill="#D9A0AE" fillOpacity="0.6" />
            })}
            <circle cx="10" cy="10" r="2" fill="#C4788A" fillOpacity="0.7" />
          </svg>
        </motion.div>

        {/* Bride name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="font-cormorant font-light text-w-ink text-4xl sm:text-5xl md:text-6xl leading-none tracking-wide"
        >
          {brideName}
        </motion.h1>

        {/* Bottom ornament */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="flex items-center gap-3 mt-6 mb-6 w-full max-w-xs"
        >
          <div className="flex-1 h-px bg-w-border" />
          <div className="w-1.5 h-1.5 rotate-45 bg-w-rose/50" />
          <div className="flex-1 h-px bg-w-border" />
        </motion.div>

        {/* Guest name */}
        {guestName && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="mb-7 px-6 py-4 border border-w-border bg-white/60 backdrop-blur-sm shadow-soft"
          >
            <p className="text-w-muted font-poppins font-light text-[10px] tracking-[0.3em] uppercase mb-1">
              Kepada Yang Terhormat
            </p>
            <p className="text-w-ink font-poppins font-medium text-base sm:text-lg">
              {guestName}
            </p>
          </motion.div>
        )}

        {/* Open button */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenClick}
          aria-label="Buka undangan pernikahan"
          className="
            group relative overflow-hidden
            min-h-[52px] px-10 py-3.5
            bg-w-rose text-white
            font-poppins font-medium text-sm tracking-[0.2em] uppercase
            shadow-rose
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-w-rose focus:ring-offset-2 focus:ring-offset-w-bg
          "
        >
          <span className="relative z-10">Buka Undangan</span>
          <div className="absolute inset-0 bg-w-mauve translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-w-subtle font-poppins font-light text-[10px] tracking-[0.3em] uppercase mt-6"
        >
          Dengan hormat kami mengundang kehadiran Anda
        </motion.p>
      </div>
    </div>
  )
}
