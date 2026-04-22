'use client'

import { motion } from 'framer-motion'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { SumbawaBorder } from '../ui/SumbawaBorder'
import { type QuranVerseData } from '@/lib/weddingData'

// Requirements: 8.8

interface QuranVerseSectionProps {
  verse: QuranVerseData
  isVisible?: boolean
}

export function QuranVerseSection({ verse, isVisible = false }: QuranVerseSectionProps) {
  return (
    <section className="relative py-20 px-6 bg-sumbawa-forest overflow-hidden">
      <SumbawaPattern opacity={0.05} />

      <SumbawaBorder position="top" className="absolute top-0 left-0 right-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Arabic text */}
        <p
          className="text-sumbawa-gold font-amiri text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-loose mb-8"
          dir="rtl"
          lang="ar"
        >
          {verse.arabic}
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-sumbawa-gold/40" />
          <span className="text-sumbawa-gold text-lg">✦</span>
          <div className="h-px w-16 bg-sumbawa-gold/40" />
        </div>

        {/* Translation */}
        <p className="text-sumbawa-ivory/90 font-poppins font-light text-sm sm:text-base leading-relaxed italic mb-6">
          &ldquo;{verse.translation}&rdquo;
        </p>

        {/* Surah reference */}
        <p className="text-sumbawa-gold font-poppins font-medium text-sm tracking-widest">
          {verse.surah}
        </p>
      </motion.div>

      <SumbawaBorder position="bottom" className="absolute bottom-0 left-0 right-0" />
    </section>
  )
}
