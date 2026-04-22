'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { SumbawaPattern } from './ui/SumbawaPattern'

// Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 14.3

interface AnimationLayerProps {
  duration?: number     // Total animation duration in ms (default: 2500)
  isActive: boolean
  onComplete: () => void
}

export function AnimationLayer({
  duration = 2500,
  isActive,
  onComplete,
}: AnimationLayerProps) {
  const onCompleteRef = useRef(onComplete)
  const calledRef = useRef(false)

  // Keep ref up to date without re-running effect
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const leftControls = useAnimation()
  const rightControls = useAnimation()
  const containerControls = useAnimation()

  useEffect(() => {
    if (!isActive) return

    // Guard: only call onComplete once
    const safeComplete = () => {
      if (!calledRef.current) {
        calledRef.current = true
        onCompleteRef.current()
      }
    }

    // Check CSS 3D support
    const supports3D =
      typeof CSS !== 'undefined' &&
      CSS.supports('transform-style', 'preserve-3d')

    if (!supports3D) {
      // Fallback: skip animation, go straight to content
      safeComplete()
      return
    }

    // Book-open animation sequence
    const runAnimation = async () => {
      const pageDuration = (duration - 500) / 1000  // seconds for page flip
      const fadeDuration = 0.5

      // Phase 1: Both pages cover the screen (initial state)
      await Promise.all([
        leftControls.set({ rotateY: 0 }),
        rightControls.set({ rotateY: 0 }),
      ])

      // Phase 2 & 3: Pages open (staggered)
      await Promise.all([
        rightControls.start({
          rotateY: -180,
          transition: {
            duration: pageDuration,
            delay: 0.3,
            ease: [0.4, 0, 0.2, 1],
          },
        }),
        leftControls.start({
          rotateY: 180,
          transition: {
            duration: pageDuration,
            delay: 0.6,
            ease: [0.4, 0, 0.2, 1],
          },
        }),
      ])

      // Phase 4: Fade out container
      await containerControls.start({
        opacity: 0,
        transition: { duration: fadeDuration },
      })

      // Phase 5: Call onComplete
      safeComplete()
    }

    runAnimation()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  if (!isActive) return null

  return (
    <motion.div
      animate={containerControls}
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-sumbawa-ivory overflow-hidden"
      aria-hidden="true"
    >
      {/* Background pattern */}
      <SumbawaPattern opacity={0.08} />

      {/* 3D book container */}
      <div
        className="relative w-full h-full flex"
        style={{ perspective: '1200px' }}
      >
        {/* Left page */}
        <motion.div
          animate={leftControls}
          initial={{ rotateY: 0 }}
          className="w-1/2 h-full bg-sumbawa-ivory border-r border-sumbawa-gold/30 will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-sumbawa-gold/20 text-9xl font-poppins font-light">
              ✦
            </div>
          </div>
        </motion.div>

        {/* Right page */}
        <motion.div
          animate={rightControls}
          initial={{ rotateY: 0 }}
          className="w-1/2 h-full bg-sumbawa-ivory border-l border-sumbawa-gold/30 will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'right center',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-sumbawa-gold/20 text-9xl font-poppins font-light">
              ✦
            </div>
          </div>
        </motion.div>

        {/* Center spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sumbawa-gold/40 -translate-x-1/2" />
      </div>
    </motion.div>
  )
}
