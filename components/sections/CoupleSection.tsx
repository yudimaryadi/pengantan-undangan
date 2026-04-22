'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { FloralDivider } from '../ui/FloralDivider'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { type PersonData } from '@/lib/weddingData'

// Requirements: 8.7, 12.3

interface CoupleSectionProps {
  groom: PersonData
  bride: PersonData
  isVisible?: boolean
}

interface PersonCardProps {
  person: PersonData
  delay?: number
  isVisible?: boolean
}

function PersonCard({ person, delay = 0, isVisible = false }: PersonCardProps) {
  const [photoError, setPhotoError] = useState(false)
  const initial = person.fullName.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className="flex flex-col items-center text-center px-4"
    >
      {/* Photo frame */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-6">
        <div className="w-full h-full rounded-full border-4 border-sumbawa-gold overflow-hidden bg-sumbawa-maroon/20">
          {!photoError ? (
            <Image
              src={person.photo}
              alt={`Foto ${person.fullName}`}
              fill
              className="object-cover rounded-full"
              onError={() => setPhotoError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sumbawa-maroon to-sumbawa-forest">
              <span className="text-sumbawa-gold text-5xl font-poppins font-light">
                {initial}
              </span>
            </div>
          )}
        </div>
        {/* Gold ring decoration */}
        <div className="absolute inset-0 rounded-full border-2 border-sumbawa-gold/30 scale-110" />
      </div>

      {/* Name */}
      <h3 className="text-sumbawa-maroon font-poppins font-semibold text-xl sm:text-2xl mb-1">
        {person.fullName}
      </h3>

      {/* Nickname */}
      <p className="text-sumbawa-gold font-poppins font-medium text-base mb-3">
        &ldquo;{person.nickname}&rdquo;
      </p>

      {/* Parent names */}
      <p className="text-sumbawa-charcoal/70 font-poppins font-light text-sm leading-relaxed max-w-xs">
        {person.parentNames}
      </p>

      {/* Instagram */}
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram ${person.fullName}: @${person.instagram}`}
          className="
            mt-4 flex items-center gap-2
            text-sumbawa-copper hover:text-sumbawa-gold
            transition-colors duration-200
            min-h-[44px] px-3
          "
        >
          <Instagram className="w-4 h-4" />
          <span className="font-poppins font-light text-sm">@{person.instagram}</span>
        </a>
      )}
    </motion.div>
  )
}

export function CoupleSection({ groom, bride, isVisible = false }: CoupleSectionProps) {
  return (
    <section className="relative py-20 px-6 bg-sumbawa-cream overflow-hidden">
      <SumbawaPattern opacity={0.04} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sumbawa-gold font-poppins font-light text-xs tracking-[0.3em] uppercase mb-2">
            Mempelai
          </p>
          <h2 className="text-sumbawa-maroon font-poppins font-semibold text-2xl sm:text-3xl">
            Pengantin Kami
          </h2>
        </motion.div>

        {/* Couple cards */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          <PersonCard person={bride} delay={0.1} isVisible={isVisible} />

          {/* Divider between cards */}
          <div className="md:hidden">
            <FloralDivider />
          </div>

          <PersonCard person={groom} delay={0.2} isVisible={isVisible} />
        </div>

        {/* Bottom floral divider */}
        <FloralDivider className="mt-12" />
      </div>
    </section>
  )
}
