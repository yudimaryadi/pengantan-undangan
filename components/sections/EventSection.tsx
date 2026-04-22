'use client'

import { motion } from 'framer-motion'
import { MapPin, CalendarDays, Clock } from 'lucide-react'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { FloralDivider } from '../ui/FloralDivider'
import { type EventData } from '@/lib/weddingData'

// Requirements: 8.5, 8.6, 12.4

interface EventSectionProps {
  events: EventData[]
  isVisible?: boolean
}

interface EventCardProps {
  event: EventData
  delay?: number
  isVisible?: boolean
}

function EventCard({ event, delay = 0, isVisible = false }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay }}
      className="
        bg-sumbawa-cream border border-sumbawa-gold/30
        p-6 sm:p-8
        flex flex-col gap-4
      "
    >
      {/* Event name */}
      <h3 className="text-sumbawa-maroon font-poppins font-semibold text-xl sm:text-2xl text-center border-b border-sumbawa-gold/30 pb-4">
        {event.name}
      </h3>

      {/* Date */}
      <div className="flex items-start gap-3">
        <CalendarDays className="w-5 h-5 text-sumbawa-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sumbawa-charcoal font-poppins font-medium text-sm">{event.date}</p>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-sumbawa-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p className="text-sumbawa-charcoal font-poppins font-light text-sm">{event.time}</p>
      </div>

      {/* Venue */}
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-sumbawa-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sumbawa-charcoal font-poppins font-medium text-sm">{event.venue}</p>
          <p className="text-sumbawa-charcoal/70 font-poppins font-light text-xs mt-1">{event.address}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Lihat lokasi ${event.venue} di Google Maps`}
          className="
            flex-1 flex items-center justify-center gap-2
            min-h-[44px] px-4 py-2
            bg-sumbawa-maroon text-sumbawa-gold border border-sumbawa-gold
            font-poppins font-medium text-xs tracking-widest uppercase
            hover:bg-sumbawa-gold hover:text-sumbawa-maroon
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-sumbawa-gold
          "
        >
          <MapPin className="w-4 h-4" />
          Lihat Lokasi
        </a>
      </div>
    </motion.div>
  )
}

export function EventSection({ events, isVisible = false }: EventSectionProps) {
  return (
    <section className="relative py-20 px-6 bg-sumbawa-ivory overflow-hidden">
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
            Acara
          </p>
          <h2 className="text-sumbawa-maroon font-poppins font-semibold text-2xl sm:text-3xl">
            Detail Acara
          </h2>
        </motion.div>

        {/* Event cards */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {events.map((event, index) => (
            <EventCard
              key={event.name}
              event={event}
              delay={index * 0.15}
              isVisible={isVisible}
            />
          ))}
        </div>

        <FloralDivider className="mt-12" />
      </div>
    </section>
  )
}
