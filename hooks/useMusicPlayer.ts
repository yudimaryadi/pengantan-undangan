'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UseMusicPlayerReturn {
  isMuted: boolean
  isPlaying: boolean
  toggle: () => void
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Custom hook for background music playback with autoplay support.
 * Handles browser autoplay policy by listening for first user interaction.
 * Loops audio continuously. Cleans up on unmount.
 *
 * Requirements: 4.2, 4.3, 4.4, 4.5, 4.9
 */
export function useMusicPlayer(url: string, autoPlay: boolean = true): UseMusicPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  // Guard to prevent attaching multiple autoplay listeners
  const listenerAttachedRef = useRef(false)

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio(url)
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [url])

  // Autoplay logic
  useEffect(() => {
    if (!autoPlay) return

    const audio = audioRef.current
    if (!audio) return

    const playOnFirstInteraction = () => {
      if (!audioRef.current) return
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {/* silently ignore */})
    }

    // Try immediate autoplay
    audio
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(() => {
        // Browser blocked autoplay — wait for first user interaction
        if (!listenerAttachedRef.current) {
          listenerAttachedRef.current = true
          document.addEventListener('click', playOnFirstInteraction, { once: true })
        }
      })

    return () => {
      document.removeEventListener('click', playOnFirstInteraction)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay])

  /**
   * Toggles mute/unmute state.
   * Calling toggle() twice returns to the original state (idempotent round-trip).
   * Requirements: 4.5
   */
  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    const newMuted = !isMuted
    audio.muted = newMuted
    setIsMuted(newMuted)
  }, [isMuted])

  return { isMuted, isPlaying, toggle }
}
