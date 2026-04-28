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

// Pre-computed bokeh — no runtime Math
const BOKEH = [
  { x: 15, y: 10, r: 100, c: '#C4788A', o: 0.07 },
  { x: 80, y: 12, r: 90,  c: '#D9A0AE', o: 0.06 },
  { x: 8,  y: 60, r: 80,  c: '#B8965A', o: 0.05 },
  { x: 88, y: 58, r: 100, c: '#C4788A', o: 0.06 },
  { x: 50, y: 5,  r: 140, c: '#F2DDE2', o: 0.09 },
  { x: 50, y: 92, r: 160, c: '#F2DDE2', o: 0.08 },
]

export function CoverScreen({
  groomName, brideName, isVisible, guestName, onOpenClick,
}: CoverScreenProps) {
  const [illustrationError, setIllustrationError] = useState(false)
  if (!isVisible) return null

  const groomInitial = groomName.charAt(0).toUpperCase()
  const brideInitial = brideName.charAt(0).toUpperCase()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Garden gradient background ── */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 45%, #F5E8E8 100%)' }} />

      {/* ── Bokeh depth ── */}
      {BOKEH.map((b, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: b.r * 2, height: b.r * 2,
            transform: 'translate(-50%, -50%)',
            background: b.c, opacity: b.o,
            filter: 'blur(40px)',
          }}
        />
      ))}

      {/* ── Dot pattern ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1' fill='%23C4788A'/%3E%3C/svg%3E")`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Floral corners ── */}
      <FloralCorner position="top-left" size="lg" />
      <FloralCorner position="top-right" size="lg" />
      <FloralCorner position="bottom-left" size="md" />
      <FloralCorner position="bottom-right" size="md" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 py-12 text-center max-w-lg mx-auto w-full">

        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-4"
        >
          The Wedding of
        </motion.p>

        {/* Thin line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex items-center gap-3 mb-5 w-full max-w-xs"
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
          className="text-w-gold font-amiri text-xl mb-5"
          dir="rtl" lang="ar"
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </motion.p>

        {/* ── Couple illustration ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.55 }}
          className="relative mb-5 flex justify-center w-full"
        >
          {/* Glow behind */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(196,120,138,0.14) 0%, transparent 70%)' }} />
          </div>

          {!illustrationError ? (
            <div className="relative" style={{ width: 'min(260px, 65vw)', height: 'min(350px, 88vw)' }}>
              <Image
                src="/images/couple-illustration-removebg.png"
                alt={`${groomName} & ${brideName}`}
                fill
                className="object-contain"
                priority
                style={{ filter: 'drop-shadow(0 10px 28px rgba(196,120,138,0.22))' }}
                onError={() => setIllustrationError(true)}
              />
            </div>
          ) : (
            /* Fallback initials */
            <div className="w-48 h-48 rounded-full bg-w-overlay border-2 border-w-border flex items-center justify-center shadow-card">
              <span className="text-w-rose/50 text-5xl font-cormorant font-light">
                {groomInitial}&amp;{brideInitial}
              </span>
            </div>
          )}
        </motion.div>

        {/* Groom name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl md:text-5xl leading-none tracking-wide"
        >
          {groomName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="my-2"
        >
          <span className="text-w-rose font-cormorant text-2xl italic">&amp;</span>
        </motion.div>

        {/* Bride name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.72 }}
          className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl md:text-5xl leading-none tracking-wide"
        >
          {brideName}
        </motion.h1>

        {/* Bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex items-center gap-3 mt-5 mb-5 w-full max-w-xs"
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
            className="mb-6 px-6 py-4 border border-w-border bg-white/60 backdrop-blur-sm shadow-soft w-full max-w-xs"
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
          className="text-w-subtle font-poppins font-light text-[10px] tracking-[0.3em] uppercase mt-5"
        >
          Dengan hormat kami mengundang kehadiran Anda
        </motion.p>
      </div>
    </div>
  )
}
