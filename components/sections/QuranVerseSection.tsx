'use client'

import { motion } from 'framer-motion'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
import { WordReveal } from '../ui/TextReveal'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { type QuranVerseData } from '@/lib/weddingData'

interface QuranVerseSectionProps {
  verse: QuranVerseData
  isVisible?: boolean
}

export function QuranVerseSection({ verse, isVisible = false }: QuranVerseSectionProps) {
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.2 })
  const inView = isVisible || isInView

  return (
    <section className="relative py-24 px-6 bg-w-bgAlt overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <FloralCorner position="bottom-left" size="sm" />
      <FloralCorner position="bottom-right" size="sm" />

      {/* Animated background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-w-rose-pale/40 rounded-full blur-3xl pointer-events-none"
        animate={inView ? { scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div ref={ref} className="relative z-10 max-w-2xl mx-auto text-center">

        {/* Decorative line — draws in */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-w-rose/40" />
          <motion.div
            className="w-1.5 h-1.5 rotate-45 bg-w-rose/60"
            animate={inView ? { rotate: [45, 225, 45] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-w-rose/40" />
        </motion.div>

        {/* Arabic text — slides down with blur */}
        <motion.p
          initial={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-w-ink/80 font-amiri text-2xl sm:text-3xl md:text-4xl leading-loose mb-10"
          dir="rtl" lang="ar"
        >
          {verse.arabic}
        </motion.p>

        {/* Divider — fade in */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-8 bg-w-gold/30" />
          <span className="text-w-gold/50 text-xs">✦</span>
          <div className="h-px w-8 bg-w-gold/30" />
        </motion.div>

        {/* Translation — word by word reveal */}
        <div className="text-w-body font-poppins font-light text-sm sm:text-base leading-relaxed italic mb-6">
          <span>&ldquo;</span>
          <WordReveal text={verse.translation} isInView={inView} delay={0.9} staggerDelay={0.04} />
          <span>&rdquo;</span>
        </div>

        {/* Surah — slide up */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-w-gold font-poppins font-medium text-xs tracking-[0.2em] uppercase"
        >
          {verse.surah}
        </motion.p>

        <FloralDivider variant="gold" className="mt-10" />
      </div>
    </section>
  )
}
