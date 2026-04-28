'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FloralCorner } from '../ui/FloralCorner'
import { FloralDivider } from '../ui/FloralDivider'
import { type PersonData } from '@/lib/weddingData'

interface HeroSectionProps {
  groom: PersonData
  bride: PersonData
  eventDate: string
  isVisible?: boolean
}

// Pre-computed bokeh positions — no runtime Math
const BOKEH = [
  { x: 10, y: 20, r: 80,  c: '#C4788A', o: 0.06 },
  { x: 85, y: 15, r: 100, c: '#D9A0AE', o: 0.05 },
  { x: 5,  y: 70, r: 60,  c: '#B8965A', o: 0.04 },
  { x: 90, y: 65, r: 90,  c: '#C4788A', o: 0.05 },
  { x: 50, y: 5,  r: 120, c: '#F2DDE2', o: 0.08 },
  { x: 50, y: 90, r: 140, c: '#F2DDE2', o: 0.07 },
]

// Pre-computed floating petal positions
const PETALS = [
  { x: 8,  y: 15, r: -20, s: 0.6, c: '#D9A0AE' },
  { x: 18, y: 40, r: 15,  s: 0.5, c: '#E8B4C0' },
  { x: 78, y: 20, r: 25,  s: 0.6, c: '#C4788A' },
  { x: 88, y: 50, r: -10, s: 0.5, c: '#D9A0AE' },
  { x: 12, y: 75, r: 30,  s: 0.4, c: '#F2DDE2' },
  { x: 82, y: 78, r: -25, s: 0.4, c: '#E8B4C0' },
]

export function HeroSection({ groom, bride, eventDate, isVisible = false }: HeroSectionProps) {
  const [coupleError, setCoupleError] = useState(false)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* ── Garden gradient background ── */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 45%, #F5E8E8 100%)' }} />

      {/* ── Bokeh depth circles ── */}
      {BOKEH.map((b, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: b.r * 2, height: b.r * 2,
            transform: 'translate(-50%, -50%)',
            background: b.c,
            opacity: b.o,
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

      {/* ── Floating petals ── */}
      {PETALS.map((p, i) => (
        <motion.div key={i}
          className="absolute pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -12, 0], rotate: [p.r, p.r + 8, p.r] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          <svg width={16 * p.s} height={24 * p.s} viewBox="-8 -12 16 24" fill="none">
            <path d="M0,-11 C4,-7 4,7 0,11 C-4,7 -4,-7 0,-11" fill={p.c} fillOpacity="0.5" />
          </svg>
        </motion.div>
      ))}

      {/* ── Floral corners ── */}
      <FloralCorner position="top-left" size="md" />
      <FloralCorner position="top-right" size="md" />
      <FloralCorner position="bottom-left" size="sm" />
      <FloralCorner position="bottom-right" size="sm" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center max-w-2xl mx-auto w-full">

        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={isVisible ? { opacity: 1, letterSpacing: '0.5em' } : {}}
          transition={{ duration: 1.2 }}
          className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-8"
        >
          The Wedding of
        </motion.p>

        {/* Couple illustration — center piece */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.1 }}
          className="relative mb-8 w-full flex justify-center"
        >
          {/* Soft glow behind illustration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(196,120,138,0.12) 0%, transparent 70%)' }} />
          </div>

          {!coupleError ? (
            <div className="relative" style={{ width: 'min(280px, 70vw)', height: 'min(380px, 95vw)' }}>
              <Image
                src="/images/couple-illustration-removebg.png"
                alt={`${groom.fullName} & ${bride.fullName}`}
                fill
                className="object-contain"
                priority
                style={{ filter: 'drop-shadow(0 12px 32px rgba(196,120,138,0.2))' }}
                onError={() => setCoupleError(true)}
              />
            </div>
          ) : (
            /* Fallback: show groom photo as background */
            <div className="relative rounded-full overflow-hidden border-4 border-w-border shadow-card"
              style={{ width: 200, height: 200 }}>
              <Image src={groom.photo} alt={groom.fullName} fill className="object-cover" />
            </div>
          )}
        </motion.div>

        {/* Groom name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none tracking-wide mb-3"
        >
          {groom.fullName}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="my-3 flex items-center gap-4"
        >
          <div className="h-px w-10 bg-w-border" />
          <span className="text-w-rose font-cormorant text-2xl italic">&amp;</span>
          <div className="h-px w-10 bg-w-border" />
        </motion.div>

        {/* Bride name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none tracking-wide mb-8"
        >
          {bride.fullName}
        </motion.h2>

        <FloralDivider variant="rose" className="my-2" />

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-w-body font-poppins font-light text-sm tracking-[0.25em] mt-2"
        >
          {eventDate}
        </motion.p>
      </div>
    </section>
  )
}
