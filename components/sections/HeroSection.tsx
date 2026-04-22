'use client'

import Image from 'next/image'
import { useState } from 'react'
import { SumbawaBorder } from '../ui/SumbawaBorder'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { type PersonData } from '@/lib/weddingData'

// Requirements: 8.1, 12.2

interface HeroSectionProps {
  groom: PersonData
  bride: PersonData
  eventDate: string
  isVisible?: boolean
}

export function HeroSection({ groom, bride, eventDate }: HeroSectionProps) {
  const [photoError, setPhotoError] = useState(false)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-sumbawa-maroon">
      <SumbawaPattern opacity={0.06} />

      {/* Background photo */}
      <div className="absolute inset-0">
        {!photoError ? (
          <Image
            src={groom.photo}
            alt={`${groom.fullName} & ${bride.fullName}`}
            fill
            className="object-cover"
            priority
            onError={() => setPhotoError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sumbawa-maroon to-sumbawa-forest" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-sumbawa-maroon/60 via-sumbawa-maroon/30 to-sumbawa-maroon/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center max-w-3xl mx-auto">
        <p className="text-sumbawa-gold/80 font-poppins font-light text-xs tracking-[0.3em] uppercase mb-8">
          The Wedding of
        </p>

        <div className="w-full max-w-md mb-4">
          <SumbawaBorder position="top" />
        </div>

        {/* Groom name */}
        <h2 className="text-sumbawa-gold font-poppins font-light tracking-widest text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight">
          {groom.fullName}
        </h2>

        <p className="text-sumbawa-ivory font-poppins font-light text-3xl my-2 opacity-60">
          &amp;
        </p>

        {/* Bride name */}
        <h2 className="text-sumbawa-gold font-poppins font-light tracking-widest text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight">
          {bride.fullName}
        </h2>

        <div className="w-full max-w-md mt-4 mb-8">
          <SumbawaBorder position="bottom" />
        </div>

        {/* Date */}
        <p className="text-sumbawa-ivory font-poppins font-light text-base sm:text-lg tracking-widest">
          {eventDate}
        </p>
      </div>
    </section>
  )
}
