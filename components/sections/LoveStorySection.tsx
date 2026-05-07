'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
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
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.3 })
  const inView = isVisible || isInView
  const isLeft = index % 2 === 0

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -40 : 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <>
      {/* Mobile */}
      <div ref={ref} className="md:hidden flex gap-5 items-start mb-8">
        <div className="flex flex-col items-center flex-shrink-0 pt-1">
          <motion.div
            className="w-8 h-8 rounded-full bg-white border border-w-border shadow-soft flex items-center justify-center text-sm flex-shrink-0"
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 }}
          >
            {item.icon || '✦'}
          </motion.div>
          <motion.div
            className="w-px bg-w-line mt-2 min-h-[32px]"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            style={{ transformOrigin: 'top' }}
          />
        </div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: index * 0.1 + 0.1 }}
          className="flex-1 pb-2 bg-white border border-w-line p-4 shadow-soft"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.2em] uppercase mb-1">{item.date}</p>
          <h3 className="font-cormorant font-light text-w-ink text-lg mb-2 tracking-wide">{item.title}</h3>
          <p className="text-w-body font-poppins font-light text-sm leading-relaxed">{item.description}</p>
        </motion.div>
      </div>

      {/* Desktop */}
      <div ref={ref} className="hidden md:grid md:grid-cols-[1fr_48px_1fr] gap-6 items-start mb-10">
        {isLeft ? (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: index * 0.1 }}
            className="text-right pt-1 bg-white border border-w-line p-5 shadow-soft"
          >
            <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.2em] uppercase mb-1">{item.date}</p>
            <h3 className="font-cormorant font-light text-w-ink text-xl mb-2 tracking-wide">{item.title}</h3>
            <p className="text-w-body font-poppins font-light text-sm leading-relaxed">{item.description}</p>
          </motion.div>
        ) : <div />}

        <div className="flex flex-col items-center">
          <motion.div
            className="w-10 h-10 rounded-full bg-white border border-w-border shadow-soft flex items-center justify-center text-base z-10 relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 }}
          >
            {item.icon || '✦'}
          </motion.div>
        </div>

        {!isLeft ? (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: index * 0.1 }}
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
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation({ once: true, amount: 0.3 })

  // Timeline line draw animation
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 20%'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="relative py-24 px-6 bg-w-bg overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-w-rose-pale/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3"
          >
            Kisah Kami
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide"
          >
            Love Story
          </motion.h2>
          <FloralDivider variant="rose" className="mt-4 mb-0" />
        </div>

        {/* Desktop: animated timeline line that draws as you scroll */}
        <div ref={timelineRef} className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-w-line -translate-x-1/2 overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-w-rose/60 to-w-rose/20"
              style={{ height: lineHeight, transformOrigin: 'top' }}
            />
          </div>

          {items.map((item, index) => (
            <TimelineItem key={`${item.title}-${index}`} item={item} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
