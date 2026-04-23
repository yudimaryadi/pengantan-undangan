'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface AnimationLayerProps {
  duration?: number
  isActive: boolean
  onComplete: () => void
}

export function AnimationLayer({
  duration = 2800,
  isActive,
  onComplete,
}: AnimationLayerProps) {
  const onCompleteRef = useRef(onComplete)
  const calledRef = useRef(false)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const leftControls = useAnimation()
  const rightControls = useAnimation()
  const containerControls = useAnimation()
  const centerLineControls = useAnimation()

  useEffect(() => {
    if (!isActive) return

    const safeComplete = () => {
      if (!calledRef.current) {
        calledRef.current = true
        onCompleteRef.current()
      }
    }

    const supports3D =
      typeof CSS !== 'undefined' &&
      CSS.supports('transform-style', 'preserve-3d')

    if (!supports3D) {
      safeComplete()
      return
    }

    const runAnimation = async () => {
      // Center line appears first
      await centerLineControls.start({
        scaleY: 1,
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeOut' },
      })

      // Pages open with spring physics
      await Promise.all([
        rightControls.start({
          rotateY: -180,
          transition: {
            duration: (duration - 800) / 1000,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        }),
        leftControls.start({
          rotateY: 180,
          transition: {
            duration: (duration - 800) / 1000,
            delay: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        }),
      ])

      // Fade out
      await containerControls.start({
        opacity: 0,
        scale: 1.02,
        transition: { duration: 0.5, ease: 'easeIn' },
      })

      safeComplete()
    }

    runAnimation()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  if (!isActive) return null

  return (
    <motion.div
      animate={containerControls}
      initial={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: '#FDF8F5' }}
      aria-hidden="true"
    >
      {/* Soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(196,120,138,0.08) 0%, transparent 70%)' }} />

      {/* 3D gate container */}
      <div className="relative w-full h-full flex" style={{ perspective: '1400px' }}>

        {/* Left gate door */}
        <motion.div
          animate={leftControls}
          initial={{ rotateY: 0 }}
          className="w-1/2 h-full will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #F5E8E8 0%, #FDF0F0 40%, #F5E8E8 100%)',
            borderRight: '1px solid rgba(196,120,138,0.25)',
          }}
        >
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1' fill='%23C4788A'/%3E%3C/svg%3E")`,
                backgroundSize: '32px 32px',
              }}
            />
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ border: '1px solid rgba(196,120,138,0.2)' }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ border: '1px solid rgba(196,120,138,0.3)' }}>
                <div className="w-2 h-2 rotate-45" style={{ background: 'rgba(196,120,138,0.4)' }} />
              </div>
            </motion.div>
          </div>
          {/* Right edge shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-8"
            style={{ background: 'linear-gradient(to right, transparent, rgba(196,120,138,0.12))' }} />
        </motion.div>

        {/* Right gate door */}
        <motion.div
          animate={rightControls}
          initial={{ rotateY: 0 }}
          className="w-1/2 h-full will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'right center',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(225deg, #F5E8E8 0%, #FDF0F0 40%, #F5E8E8 100%)',
            borderLeft: '1px solid rgba(196,120,138,0.25)',
          }}
        >
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1' fill='%23C4788A'/%3E%3C/svg%3E")`,
                backgroundSize: '32px 32px',
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ border: '1px solid rgba(196,120,138,0.2)' }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ border: '1px solid rgba(196,120,138,0.3)' }}>
                <div className="w-2 h-2 rotate-45" style={{ background: 'rgba(196,120,138,0.4)' }} />
              </div>
            </motion.div>
          </div>
          {/* Left edge shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-8"
            style={{ background: 'linear-gradient(to left, transparent, rgba(196,120,138,0.12))' }} />
        </motion.div>

        {/* Center spine */}
        <motion.div
          animate={centerLineControls}
          initial={{ scaleY: 0, opacity: 0 }}
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-center"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,120,138,0.5), transparent)' }}
        />
      </div>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center"
        >
          <p className="font-cormorant text-2xl font-light tracking-widest italic"
            style={{ color: 'rgba(196,120,138,0.5)' }}>
            Selamat Datang
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
