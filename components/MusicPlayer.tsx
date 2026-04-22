'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useMusicPlayer } from '@/hooks/useMusicPlayer'

// Requirements: 4.1, 4.5, 4.6, 4.7, 4.8, 4.10

interface MusicPlayerProps {
  musicUrl: string
  autoPlay?: boolean
}

export function MusicPlayer({ musicUrl, autoPlay = true }: MusicPlayerProps) {
  const { isMuted, isPlaying, toggle } = useMusicPlayer(musicUrl, autoPlay)

  return (
    <button
      onClick={toggle}
      aria-label={isMuted ? 'Aktifkan musik' : 'Matikan musik'}
      title={isMuted ? 'Aktifkan musik' : 'Matikan musik'}
      className={`
        fixed bottom-4 right-4 md:bottom-6 md:right-6
        w-12 h-12 md:w-14 md:h-14
        rounded-full bg-sumbawa-maroon border-2 border-sumbawa-gold
        flex items-center justify-center
        shadow-lg z-50 transition-all duration-300
        hover:bg-sumbawa-gold hover:border-sumbawa-maroon
        focus:outline-none focus:ring-2 focus:ring-sumbawa-gold focus:ring-offset-2
        ${isPlaying && !isMuted ? 'animate-pulse' : ''}
      `}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-sumbawa-gold group-hover:text-sumbawa-maroon" />
      ) : (
        <Volume2 className="w-5 h-5 text-sumbawa-gold" />
      )}
    </button>
  )
}
