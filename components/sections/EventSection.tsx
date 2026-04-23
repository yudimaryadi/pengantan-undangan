'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, CalendarDays } from 'lucide-react'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
import { type EventData } from '@/lib/weddingData'

interface EventSectionProps {
  events: EventData[]
  isVisible?: boolean
}

interface EventCardProps {
  event: EventData
  delay?: number
  isVisible?: boolean
  index: number
}

function EventCard({ event, delay = 0, isVisible = false, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="relative bg-white border border-w-border p-6 sm:p-8 flex flex-col gap-5 shadow-soft hover:shadow-card transition-shadow duration-300"
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${index === 0 ? 'bg-w-rose' : 'bg-w-gold'}`} style={{ opacity: 0.5 }} />

      <div className="flex items-center gap-3 pb-4 border-b border-w-line">
        <div className={`w-1 h-6 ${index === 0 ? 'bg-w-rose' : 'bg-w-gold'}`} style={{ opacity: 0.6 }} />
        <h3 className="font-cormorant font-light text-w-ink text-xl sm:text-2xl tracking-wide">
          {event.name}
        </h3>
      </div>

      <div className="flex items-start gap-3">
        <CalendarDays className="w-4 h-4 text-w-muted mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p className="text-w-body font-poppins font-light text-sm">{event.date}</p>
      </div>
      <div className="flex items-start gap-3">
        <Clock className="w-4 h-4 text-w-muted mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p className="text-w-body font-poppins font-light text-sm">{event.time}</p>
      </div>
      <div className="flex items-start gap-3">
        <MapPin className="w-4 h-4 text-w-muted mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="text-w-body font-poppins font-light text-sm">{event.venue}</p>
          <p className="text-w-subtle font-poppins font-light text-xs mt-1 leading-relaxed">{event.address}</p>
        </div>
      </div>

      <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer"
        aria-label={`Lihat lokasi ${event.venue} di Google Maps`}
        className="mt-2 flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 border border-w-border text-w-muted font-poppins font-light text-xs tracking-[0.15em] uppercase hover:border-w-rose hover:text-w-rose transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-w-rose">
        <MapPin className="w-3.5 h-3.5" />
        Lihat Lokasi
      </a>
    </motion.div>
  )
}

export function EventSection({ events, isVisible = false }: EventSectionProps) {
  return (
    <section className="relative py-24 px-6 bg-w-bg overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-w-rose-pale/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">Acara</p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide">Detail Acara</h2>
          <FloralDivider variant="rose" className="mt-4 mb-0" />
        </motion.div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          {events.map((event, index) => (
            <EventCard key={event.name} event={event} index={index} delay={index * 0.15} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
