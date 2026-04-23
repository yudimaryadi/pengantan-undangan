'use client'

import { motion } from 'framer-motion'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
import { type QuranVerseData } from '@/lib/weddingData'

interface QuranVerseSectionProps {
  verse: QuranVerseData
  isVisible?: boolean
}

export function QuranVerseSection({ verse, isVisible = false }: QuranVerseSectionProps) {
  return (
    <section className="relative py-24 px-6 bg-w-bgAlt overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <FloralCorner position="bottom-left" size="sm" />
      <FloralCorner position="bottom-right" size="sm" />

      {/* Soft center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-w-rose-pale/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <FloralDivider variant="rose" className="mb-10" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-w-ink/80 font-amiri text-2xl sm:text-3xl md:text-4xl leading-loose mb-10"
          dir="rtl" lang="ar"
        >
          {verse.arabic}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-8 bg-w-gold/40" />
          <span className="text-w-gold text-xs">✦</span>
          <div className="h-px w-8 bg-w-gold/40" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-w-body font-poppins font-light text-sm sm:text-base leading-relaxed italic mb-6"
        >
          &ldquo;{verse.translation}&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-w-gold font-poppins font-medium text-xs tracking-[0.2em] uppercase"
        >
          {verse.surah}
        </motion.p>

        <FloralDivider variant="gold" className="mt-10" />
      </div>
    </section>
  )
}
