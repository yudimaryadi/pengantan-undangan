'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FloralCorner } from '../ui/FloralCorner'
import { FloralDivider } from '../ui/FloralDivider'
import { TextReveal } from '../ui/TextReveal'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { type PersonData } from '@/lib/weddingData'

interface HeroSectionProps {
  groom: PersonData
  bride: PersonData
  eventDate: string
  isVisible?: boolean
}

const BOKEH = [
  { x: 15, y: 10, r: 100, c: '#C4788A', o: 0.07 },
  { x: 80, y: 12, r: 90,  c: '#D9A0AE', o: 0.06 },
  { x: 8,  y: 60, r: 80,  c: '#B8965A', o: 0.05 },
  { x: 88, y: 58, r: 100, c: '#C4788A', o: 0.06 },
  { x: 50, y: 5,  r: 140, c: '#F2DDE2', o: 0.09 },
  { x: 50, y: 92, r: 160, c: '#F2DDE2', o: 0.08 },
]

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
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.2 })

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const petalY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const coupleY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])

  const inView = isVisible || isInView

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 45%, #F5E8E8 100%)' }} />

      {BOKEH.map((b, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.r * 2, height: b.r * 2,
            transform: 'translate(-50%, -50%)', background: b.c, opacity: b.o, filter: 'blur(40px)' }} />
      ))}

      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1' fill='%23C4788A'/%3E%3C/svg%3E")`, backgroundSize: '32px 32px' }} />

      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: petalY }}>
        {PETALS.map((p, i) => (
          <motion.div key={i} className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ y: [0, -12, 0], rotate: [p.r, p.r + 8, p.r] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            <svg width={16 * p.s} height={24 * p.s} viewBox="-8 -12 16 24" fill="none">
              <path d="M0,-11 C4,-7 4,7 0,11 C-4,7 -4,-7 0,-11" fill={p.c} fillOpacity="0.5" />
            </svg>
          </motion.div>
        ))}
      </motion.div>

      <FloralCorner position="top-left" size="md" />
      <FloralCorner position="top-right" size="md" />
      <FloralCorner position="bottom-left" size="sm" />
      <FloralCorner position="bottom-right" size="sm" />

      <div ref={ref} className="relative z-10 flex flex-col items-center px-6 py-16 text-center max-w-2xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={inView ? { opacity: 1, letterSpacing: '0.5em' } : {}}
          transition={{ duration: 1.2 }}
          className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-8"
        >
          The Wedding of
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.1 }}
          style={{ y: coupleY }}
          className="relative mb-8 flex justify-center w-full"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(196,120,138,0.14) 0%, transparent 70%)' }} />
          </div>
          {!coupleError ? (
            <div className="relative" style={{ width: 'min(260px, 65vw)', height: 'min(350px, 88vw)' }}>
              <Image src="/images/couple-illustration-removebg.png" alt={`${groom.fullName} & ${bride.fullName}`}
                fill className="object-contain" priority
                style={{ filter: 'drop-shadow(0 10px 28px rgba(196,120,138,0.22))' }}
                onError={() => setCoupleError(true)} />
            </div>
          ) : (
            <div className="relative rounded-full overflow-hidden border-4 border-w-border shadow-card"
              style={{ width: 200, height: 200 }}>
              <Image src={groom.photo} alt={groom.fullName} fill className="object-cover" />
            </div>
          )}
        </motion.div>

        <div className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none tracking-wide mb-3 overflow-hidden">
          <TextReveal text={groom.fullName} isInView={inView} delay={0.3} staggerDelay={0.025} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="my-3 flex items-center gap-4"
        >
          <div className="h-px w-10 bg-w-border" />
          <span className="text-w-rose font-cormorant text-2xl italic">&amp;</span>
          <div className="h-px w-10 bg-w-border" />
        </motion.div>

        <div className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none tracking-wide mb-8 overflow-hidden">
          <TextReveal text={bride.fullName} isInView={inView} delay={0.5} staggerDelay={0.025} />
        </div>

        <FloralDivider variant="rose" className="my-2" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-w-body font-poppins font-light text-sm tracking-[0.25em] mt-2"
        >
          {eventDate}
        </motion.p>
      </div>
    </section>
  )
}
