'use client'

import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useMusicPlayer } from '@/hooks/useMusicPlayer'

interface MusicPlayerProps {
  musicUrl: string
  autoPlay?: boolean
}

export function MusicPlayer({ musicUrl, autoPlay = true }: MusicPlayerProps) {
  const { isMuted, isPlaying, toggle } = useMusicPlayer(musicUrl, autoPlay)

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      onClick={toggle}
      aria-label={isMuted ? 'Aktifkan musik' : 'Matikan musik'}
      title={isMuted ? 'Aktifkan musik' : 'Matikan musik'}
      className="
        fixed bottom-5 right-5 md:bottom-6 md:right-6
        w-11 h-11 md:w-12 md:h-12
        rounded-full
        bg-white border border-w-border
        flex items-center justify-center
        shadow-card z-50
        hover:border-w-rose hover:text-w-rose
        transition-all duration-300
        focus:outline-none focus:ring-1 focus:ring-w-rose
        text-w-muted
      "
    >
      {isPlaying && !isMuted && (
        <motion.div
          className="absolute inset-0 rounded-full border border-w-rose/30"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </motion.button>
  )
}
