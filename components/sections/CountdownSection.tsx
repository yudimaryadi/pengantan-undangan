'use client'

import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { useCountdown } from '@/hooks/useCountdown'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'

interface CountdownSectionProps {
  targetDate: string
  eventName?: string
  googleCalendarUrl?: string
  isVisible?: boolean
}

interface CountdownBoxProps {
  value: number
  label: string
  delay?: number
  isVisible?: boolean
}

function CountdownBox({ value, label, delay = 0, isVisible = false }: CountdownBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center gap-2"
    >
      <div className="
        relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
        bg-white border border-w-border shadow-soft
        flex items-center justify-center overflow-hidden
      ">
        <div className="absolute inset-0 bg-gradient-to-br from-w-rose-pale/30 to-transparent" />
        <span className="relative text-w-ink font-cormorant font-light text-2xl md:text-3xl lg:text-4xl">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-w-muted font-poppins font-light text-[10px] tracking-[0.2em] uppercase">
        {label}
      </span>
    </motion.div>
  )
}

export function CountdownSection({
  targetDate, eventName = 'Hari Pernikahan Kami', googleCalendarUrl, isVisible = false,
}: CountdownSectionProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate)

  return (
    <section className="relative py-24 px-6 bg-w-bgAlt overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <FloralCorner position="bottom-left" size="sm" />
      <FloralCorner position="bottom-right" size="sm" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-w-gold-pale/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">
            Save The Date
          </p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide">
            {eventName}
          </h2>
          <FloralDivider variant="gold" className="mt-4 mb-0" />
        </motion.div>

        {isExpired ? (
          <motion.div initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : {}} transition={{ duration: 0.8 }} className="py-8">
            <p className="text-w-rose font-cormorant font-light text-2xl sm:text-3xl tracking-wide">
              Alhamdulillah, kami telah menikah 🎉
            </p>
          </motion.div>
        ) : (
          <div className="flex items-end justify-center gap-3 sm:gap-5 mb-12">
            <CountdownBox value={days} label="Hari" delay={0.1} isVisible={isVisible} />
            <motion.span initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
              className="text-w-rose/50 text-2xl font-light mb-8">:</motion.span>
            <CountdownBox value={hours} label="Jam" delay={0.2} isVisible={isVisible} />
            <motion.span initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
              className="text-w-rose/50 text-2xl font-light mb-8">:</motion.span>
            <CountdownBox value={minutes} label="Menit" delay={0.3} isVisible={isVisible} />
            <motion.span initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
              className="text-w-rose/50 text-2xl font-light mb-8">:</motion.span>
            <CountdownBox value={seconds} label="Detik" delay={0.4} isVisible={isVisible} />
          </div>
        )}

        {googleCalendarUrl && (
          <motion.a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer"
            aria-label="Simpan tanggal pernikahan ke Google Calendar"
            initial={{ opacity: 0, y: 10 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 border border-w-border text-w-muted font-poppins font-light text-xs tracking-[0.2em] uppercase hover:border-w-rose hover:text-w-rose bg-white shadow-soft transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-w-rose">
            <CalendarDays className="w-4 h-4" />
            Simpan Tanggal
          </motion.a>
        )}
      </div>
    </section>
  )
}
