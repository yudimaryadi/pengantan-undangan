'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
import { type PersonData } from '@/lib/weddingData'

interface CoupleSectionProps {
  groom: PersonData
  bride: PersonData
  isVisible?: boolean
}

interface PersonCardProps {
  person: PersonData
  delay?: number
  isVisible?: boolean
  side: 'left' | 'right'
}

function PersonCard({ person, delay = 0, isVisible = false, side }: PersonCardProps) {
  const [photoError, setPhotoError] = useState(false)
  const initial = person.fullName.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative mb-6">
        {/* Decorative rings */}
        <div className="absolute -inset-3 rounded-full border border-w-rose/15" />
        <div className="absolute -inset-1.5 rounded-full border border-w-rose/25" />

        <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden bg-w-overlay shadow-card">
          {!photoError ? (
            <Image src={person.photo} alt={`Foto ${person.fullName}`}
              fill className="object-cover" onError={() => setPhotoError(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-w-overlay to-w-bgAlt">
              <span className="text-w-rose/40 text-5xl font-cormorant font-light">{initial}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-w-rose/10 to-transparent" />
        </div>
      </div>

      <h3 className="font-cormorant font-light text-w-ink text-2xl sm:text-3xl mb-1 tracking-wide">
        {person.fullName}
      </h3>
      <p className="text-w-rose font-poppins font-light text-xs tracking-[0.2em] uppercase mb-3">
        {person.nickname}
      </p>
      <div className="w-8 h-px bg-w-border mb-3" />
      <p className="text-w-muted font-poppins font-light text-xs sm:text-sm leading-relaxed max-w-[220px]">
        {person.parentNames}
      </p>

      {person.instagram && (
        <a href={`https://instagram.com/${person.instagram}`}
          target="_blank" rel="noopener noreferrer"
          aria-label={`Instagram ${person.fullName}: @${person.instagram}`}
          className="mt-4 flex items-center gap-2 text-w-subtle hover:text-w-rose transition-colors duration-200 min-h-[44px] px-3">
          <Instagram className="w-3.5 h-3.5" />
          <span className="font-poppins font-light text-xs">@{person.instagram}</span>
        </a>
      )}
    </motion.div>
  )
}

export function CoupleSection({ groom, bride, isVisible = false }: CoupleSectionProps) {
  return (
    <section className="relative py-24 px-6 bg-w-bg overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />

      {/* Soft ambient */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-w-rose-pale/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-w-gold-pale/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">
            Mempelai
          </p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide">
            Pengantin Kami
          </h2>
          <FloralDivider variant="rose" className="mt-4 mb-0" />
        </motion.div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-16 md:gap-8 items-center">
          <PersonCard person={bride} delay={0.1} isVisible={isVisible} side="left" />

          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
            <div className="h-16 w-px bg-w-border" />
            <span className="text-w-rose/50 font-cormorant text-xl italic">&amp;</span>
            <div className="h-16 w-px bg-w-border" />
          </div>

          <div className="md:hidden flex items-center gap-3">
            <div className="flex-1 h-px bg-w-border" />
            <span className="text-w-rose/50 font-cormorant text-xl italic">&amp;</span>
            <div className="flex-1 h-px bg-w-border" />
          </div>

          <PersonCard person={groom} delay={0.2} isVisible={isVisible} side="right" />
        </div>
      </div>
    </section>
  )
}
