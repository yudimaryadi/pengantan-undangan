'use client'

import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { useCountdown } from '@/hooks/useCountdown'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { SumbawaBorder } from '../ui/SumbawaBorder'

// Requirements: 5.1, 5.2, 5.4, 5.6

interface CountdownSectionProps {
  targetDate: string    // ISO date string: "2025-07-12T09:00:00+08:00"
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center"
    >
      <div className="
        w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
        bg-sumbawa-maroon border-2 border-sumbawa-gold
        flex items-center justify-center
        mb-2
      ">
        <span className="text-sumbawa-gold font-poppins font-semibold text-2xl md:text-3xl lg:text-4xl">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-sumbawa-ivory/70 font-poppins font-light text-xs tracking-widest uppercase">
        {label}
      </span>
    </motion.div>
  )
}

export function CountdownSection({
  targetDate,
  eventName = 'Hari Pernikahan Kami',
  googleCalendarUrl,
  isVisible = false,
}: CountdownSectionProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate)

  return (
    <section className="relative py-20 px-6 bg-sumbawa-maroon overflow-hidden">
      <SumbawaPattern opacity={0.06} />
      <SumbawaBorder position="top" className="absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-sumbawa-gold/70 font-poppins font-light text-xs tracking-[0.3em] uppercase mb-2">
            Save The Date
          </p>
          <h2 className="text-sumbawa-ivory font-poppins font-semibold text-2xl sm:text-3xl">
            {eventName}
          </h2>
        </motion.div>

        {isExpired ? (
          /* Expired state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="py-8"
          >
            <p className="text-sumbawa-gold font-poppins font-light text-xl sm:text-2xl tracking-wide">
              Alhamdulillah, kami telah menikah 🎉
            </p>
          </motion.div>
        ) : (
          /* Countdown boxes */
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-10">
            <CountdownBox value={days} label="Hari" delay={0.1} isVisible={isVisible} />
            <span className="text-sumbawa-gold text-2xl font-light mb-6">:</span>
            <CountdownBox value={hours} label="Jam" delay={0.2} isVisible={isVisible} />
            <span className="text-sumbawa-gold text-2xl font-light mb-6">:</span>
            <CountdownBox value={minutes} label="Menit" delay={0.3} isVisible={isVisible} />
            <span className="text-sumbawa-gold text-2xl font-light mb-6">:</span>
            <CountdownBox value={seconds} label="Detik" delay={0.4} isVisible={isVisible} />
          </div>
        )}

        {/* Save date button */}
        {googleCalendarUrl && (
          <motion.a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Simpan tanggal pernikahan ke Google Calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="
              inline-flex items-center gap-2
              min-h-[48px] px-6 py-3
              border border-sumbawa-gold text-sumbawa-gold
              font-poppins font-medium text-sm tracking-widest uppercase
              hover:bg-sumbawa-gold hover:text-sumbawa-maroon
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-sumbawa-gold
            "
          >
            <CalendarDays className="w-4 h-4" />
            Simpan Tanggal
          </motion.a>
        )}
      </div>

      <SumbawaBorder position="bottom" className="absolute bottom-0 left-0 right-0" />
    </section>
  )
}
