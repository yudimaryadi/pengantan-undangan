'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SumbawaBorder } from './ui/SumbawaBorder'
import { SumbawaPattern } from './ui/SumbawaPattern'

// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 14.1

interface CoverScreenProps {
  groomName: string
  brideName: string
  couplePhoto: string
  isVisible: boolean
  guestName?: string
  onOpenClick: () => void
}

export function CoverScreen({
  groomName,
  brideName,
  couplePhoto,
  isVisible,
  guestName,
  onOpenClick,
}: CoverScreenProps) {
  const [photoError, setPhotoError] = useState(false)

  if (!isVisible) return null

  // Initials for fallback placeholder
  const groomInitial = groomName.charAt(0).toUpperCase()
  const brideInitial = brideName.charAt(0).toUpperCase()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-sumbawa-maroon">
      {/* Background pattern */}
      <SumbawaPattern opacity={0.06} />

      {/* Hero photo or fallback */}
      <div className="absolute inset-0">
        {!photoError ? (
          <Image
            src={couplePhoto}
            alt={`Foto ${groomName} & ${brideName}`}
            fill
            className="object-cover"
            priority
            onError={() => setPhotoError(true)}
          />
        ) : (
          /* Fallback: gradient with initials */
          <div className="w-full h-full bg-gradient-to-br from-sumbawa-maroon via-sumbawa-forest to-sumbawa-maroon-dark flex items-center justify-center">
            <span className="text-sumbawa-gold text-8xl font-poppins font-light tracking-widest opacity-30">
              {groomInitial}&{brideInitial}
            </span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sumbawa-maroon/70 via-sumbawa-maroon/40 to-sumbawa-maroon/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-12 text-center max-w-2xl mx-auto">
        {/* Top ornament */}
        <div className="w-full max-w-sm mb-6">
          <SumbawaBorder position="top" />
        </div>

        {/* Bismillah */}
        <p className="text-sumbawa-gold font-amiri text-lg mb-4 opacity-90">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>

        {/* Wedding announcement */}
        <p className="text-sumbawa-ivory/80 font-poppins font-light text-sm tracking-widest uppercase mb-6">
          Undangan Pernikahan
        </p>

        {/* Groom name */}
        <h1 className="text-sumbawa-gold font-poppins font-light tracking-widest text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          {groomName}
        </h1>

        {/* Ampersand */}
        <p className="text-sumbawa-ivory font-poppins font-light text-4xl my-3 opacity-70">
          &amp;
        </p>

        {/* Bride name */}
        <h1 className="text-sumbawa-gold font-poppins font-light tracking-widest text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          {brideName}
        </h1>

        {/* Bottom ornament */}
        <div className="w-full max-w-sm mt-6 mb-8">
          <SumbawaBorder position="bottom" />
        </div>

        {/* Guest name — "Kepada Yang Terhormat" */}
        {guestName && (
          <div className="mb-6 text-center">
            <p className="text-sumbawa-ivory/60 font-poppins font-light text-xs tracking-[0.25em] uppercase mb-1">
              Kepada Yang Terhormat
            </p>
            <p className="text-sumbawa-gold font-poppins font-medium text-base sm:text-lg tracking-wide">
              {guestName}
            </p>
          </div>
        )}

        {/* Open button */}
        <button
          onClick={onOpenClick}
          aria-label="Buka undangan pernikahan"
          className="
            min-h-[48px] px-8 py-3
            bg-sumbawa-maroon border-2 border-sumbawa-gold
            text-sumbawa-gold font-poppins font-medium tracking-widest text-sm uppercase
            rounded-none
            hover:bg-sumbawa-gold hover:text-sumbawa-maroon
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-sumbawa-gold focus:ring-offset-2 focus:ring-offset-sumbawa-maroon
          "
        >
          Buka Undangan
        </button>

        {/* Scroll hint */}
        <p className="text-sumbawa-ivory/50 text-xs mt-6 font-poppins font-light tracking-widest">
          Dengan hormat kami mengundang kehadiran Anda
        </p>
      </div>
    </div>
  )
}
