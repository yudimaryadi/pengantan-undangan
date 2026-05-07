'use client'

import { useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Hook that returns a ref and whether the element is in view.
 * Used for triggering scroll-based entrance animations.
 */
export function useScrollAnimation(options?: { once?: boolean; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.15,
  })
  return { ref, isInView }
}
