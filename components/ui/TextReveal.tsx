'use client'

import { motion } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  isInView: boolean
  staggerDelay?: number
}

/**
 * Reveals text character by character with a stagger animation.
 * Each character slides up from below and fades in.
 */
export function TextReveal({
  text,
  className = '',
  delay = 0,
  isInView,
  staggerDelay = 0.03,
}: TextRevealProps) {
  const chars = text.split('')

  return (
    <span className={`inline-block overflow-hidden ${className}`} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          initial={{ y: '100%', opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

/**
 * Reveals text word by word.
 */
export function WordReveal({
  text,
  className = '',
  delay = 0,
  isInView,
  staggerDelay = 0.08,
}: TextRevealProps) {
  const words = text.split(' ')

  return (
    <span className={`inline ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: delay + i * staggerDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
