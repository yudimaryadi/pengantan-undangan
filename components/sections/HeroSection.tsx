'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FloralCorner } from '../ui/FloralCorner'
import { type PersonData } from '@/lib/weddingData'

interface HeroSectionProps {
  groom: PersonData
  bride: PersonData
  eventDate: string
  isVisible?: boolean
}

export function HeroSection({ groom, bride, eventDate, isVisible = false }: HeroSectionProps) {
  const [photoError, setPhotoError] = useState(false)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-w-bg">
      <FloralCorner position="top-left" size="md" />
      <FloralCorner position="top-right" size="md" />

      <div className="absolute inset-0">
        {!photoError ? (
          <Image src={groom.photo} alt={`${groom.fullName} & ${bride.fullName}`}
            fill className="object-cover" priority onError={() => setPhotoError(true)} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-w-bg to-w-bgAlt" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-w-bg/55 via-w-bg/25 to-w-bg/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-w-rose/6 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-20 text-center max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={isVisible ? { opacity: 1, letterSpacing: '0.5em' } : {}}
          transition={{ duration: 1.2 }}
          className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-10"
        >
          The Wedding of
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-cormorant font-light text-w-ink text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-wide mb-4"
        >
          {groom.fullName}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="my-4 flex items-center gap-4"
        >
          <div className="h-px w-12 bg-w-border" />
          <span className="text-w-rose font-cormorant text-2xl italic">&amp;</span>
          <div className="h-px w-12 bg-w-border" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-cormorant font-light text-w-ink text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-wide mb-10"
        >
          {bride.fullName}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isVisible ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-24 h-px bg-w-border mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-w-body font-poppins font-light text-sm tracking-[0.2em]"
        >
          {eventDate}
        </motion.p>
      </div>
    </section>
  )
}
