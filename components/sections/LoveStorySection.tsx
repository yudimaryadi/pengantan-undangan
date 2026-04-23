'use client'

import { motion } from 'framer-motion'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
import { type LoveStoryItem } from '@/lib/weddingData'

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
      {/* Mobile */}
      <div className="md:hidden flex gap-5 items-start mb-8">
        <div className="flex flex-col items-center flex-shrink-0 pt-1">
          <div className="w-8 h-8 rounded-full bg-white border border-w-border shadow-soft flex items-center justify-center text-sm flex-shrink-0">
            {item.icon || '✦'}
          </div>
          <div className="w-px flex-1 bg-w-line mt-2 min-h-[32px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.12 }}
          className="flex-1 pb-2 bg-white border border-w-line p-4 shadow-soft"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.2em] uppercase mb-1">{item.date}</p>
          <h3 className="font-cormorant font-light text-w-ink text-lg mb-2 tracking-wide">{item.title}</h3>
          <p className="text-w-body font-poppins font-light text-sm leading-relaxed">{item.description}</p>
        </motion.div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[1fr_48px_1fr] gap-6 items-start mb-10">
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.12 }}
            className="text-right pt-1 bg-white border border-w-line p-5 shadow-soft"
          >
            <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.2em] uppercase mb-1">{item.date}</p>
            <h3 className="font-cormorant font-light text-w-ink text-xl mb-2 tracking-wide">{item.title}</h3>
            <p className="text-w-body font-poppins font-light text-sm leading-relaxed">{item.description}</p>
          </motion.div>
        ) : <div />}

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white border border-w-border shadow-soft flex items-center justify-center text-base z-10 relative">
            {item.icon || '✦'}
          </div>
        </div>

        {!isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.12 }}
            className="pt-1 bg-white border border-w-line p-5 shadow-soft"
          >
            <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.2em] uppercase mb-1">{item.date}</p>
            <h3 className="font-cormorant font-light text-w-ink text-xl mb-2 tracking-wide">{item.title}</h3>
            <p className="text-w-body font-poppins font-light text-sm leading-relaxed">{item.description}</p>
          </motion.div>
        ) : <div />}
      </div>
    </>
  )
}

export function LoveStorySection({ items, isVisible = false }: LoveStorySectionProps) {
  return (
    <section className="relative py-24 px-6 bg-w-bg overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-w-rose-pale/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">Kisah Kami</p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide">Love Story</h2>
          <FloralDivider variant="rose" className="mt-4 mb-0" />
        </motion.div>

        <div className="hidden md:block absolute left-1/2 top-48 bottom-16 w-px bg-w-line -translate-x-1/2" />

        <div className="relative">
          {items.map((item, index) => (
            <TimelineItem key={`${item.title}-${index}`} item={item} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
