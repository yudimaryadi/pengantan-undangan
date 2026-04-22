'use client'

import { useEffect, useState, RefObject } from 'react'

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Custom hook that tracks which sections have entered the viewport.
 * Uses IntersectionObserver with threshold 0.15.
 * Each section is only triggered once (unobserved after becoming visible).
 * Falls back to showing all sections immediately if IntersectionObserver is unavailable.
 * Disconnects observer on unmount.
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */
export function useScrollReveal(refs: RefObject<HTMLElement | null>[]): Set<number> {
  const [visibleSet, setVisibleSet] = useState<Set<number>>(() => {
    // Fallback: if IntersectionObserver is not available, mark all as visible
    if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
      return new Set(refs.map((_, i) => i))
    }
    return new Set<number>()
  })

  useEffect(() => {
    // Fallback: IntersectionObserver not available
    if (!('IntersectionObserver' in window)) {
      setVisibleSet(new Set(refs.map((_, i) => i)))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refs.findIndex((ref) => ref.current === entry.target)
            if (index !== -1) {
              setVisibleSet((prev) => {
                if (prev.has(index)) return prev
                const next = new Set(prev)
                next.add(index)
                return next
              })
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold: 0.15 }
    )

    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return visibleSet
}
