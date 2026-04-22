'use client'

import { motion } from 'framer-motion'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { FloralDivider } from '../ui/FloralDivider'
import { type LoveStoryItem } from '@/lib/weddingData'

// Requirements: 8.9, 12.5

interface LoveStorySectionProps {
  items: LoveStoryItem[]
  isVisible?: boolean
}

interface TimelineItemProps {
  item: LoveStoryItem
  index: number
  isVisible: boolean
}

function TimelineItem({ item, index, isVisible }: TimelineItemProps) {
  const isLeft = index % 2 === 0

  return (
    <>
      {/* Mobile: single column */}
      <div className="md:hidden flex gap-4 items-start">
        {/* Left line + dot */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-sumbawa-gold flex items-center justify-center text-lg flex-shrink-0">
            {item.icon || '💛'}
          </div>
          {index < 99 && <div className="w-px flex-1 bg-sumbawa-gold/30 mt-2 min-h-[40px]" />}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          className="bg-sumbawa-cream border border-sumbawa-gold/20 p-4 flex-1 mb-6"
        >
          <p className="text-sumbawa-gold font-poppins font-light text-xs tracking-widest mb-1">
            {item.date}
          </p>
          <h3 className="text-sumbawa-maroon font-poppins font-semibold text-base mb-2">
            {item.title}
          </h3>
          <p className="text-sumbawa-charcoal/70 font-poppins font-light text-sm leading-relaxed">
            {item.description}
          </p>
        </motion.div>
      </div>

      {/* Desktop: alternating left-right */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-8">
        {/* Left content */}
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-sumbawa-cream border border-sumbawa-gold/20 p-5 text-right"
          >
            <p className="text-sumbawa-gold font-poppins font-light text-xs tracking-widest mb-1">
              {item.date}
            </p>
            <h3 className="text-sumbawa-maroon font-poppins font-semibold text-base mb-2">
              {item.title}
            </h3>
            <p className="text-sumbawa-charcoal/70 font-poppins font-light text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ) : (
          <div />
        )}

        {/* Center dot */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-sumbawa-gold flex items-center justify-center text-xl z-10">
            {item.icon || '💛'}
          </div>
        </div>

        {/* Right content */}
        {!isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-sumbawa-cream border border-sumbawa-gold/20 p-5"
          >
            <p className="text-sumbawa-gold font-poppins font-light text-xs tracking-widest mb-1">
              {item.date}
            </p>
            <h3 className="text-sumbawa-maroon font-poppins font-semibold text-base mb-2">
              {item.title}
            </h3>
            <p className="text-sumbawa-charcoal/70 font-poppins font-light text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ) : (
          <div />
        )}
      </div>
    </>
  )
}

export function LoveStorySection({ items, isVisible = false }: LoveStorySectionProps) {
  return (
    <section className="relative py-20 px-6 bg-sumbawa-ivory overflow-hidden">
      <SumbawaPattern opacity={0.04} />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sumbawa-gold font-poppins font-light text-xs tracking-[0.3em] uppercase mb-2">
            Kisah Kami
          </p>
          <h2 className="text-sumbawa-maroon font-poppins font-semibold text-2xl sm:text-3xl">
            Love Story
          </h2>
        </motion.div>

        {/* Desktop: vertical center line */}
        <div className="hidden md:block absolute left-1/2 top-40 bottom-20 w-px bg-sumbawa-gold/30 -translate-x-1/2" />

        {/* Timeline items */}
        <div className="relative">
          {items.map((item, index) => (
            <TimelineItem
              key={`${item.title}-${index}`}
              item={item}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        <FloralDivider className="mt-8" />
      </div>
    </section>
  )
}
