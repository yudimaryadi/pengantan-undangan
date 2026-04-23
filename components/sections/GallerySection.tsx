'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Expand, ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { FloralDivider } from '../ui/FloralDivider'

interface GallerySectionProps {
  photos: string[]
  isVisible?: boolean
}

interface GalleryItemProps {
  src: string
  index: number
  isVisible: boolean
  onClick: () => void
}

function GalleryItem({ src, index, isVisible, onClick }: GalleryItemProps) {
  const [error, setError] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 12) * 0.04 }}
      className="relative aspect-square overflow-hidden bg-w-overlay cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      role="button" tabIndex={0}
      aria-label={`Lihat foto ${index + 1}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-w-overlay">
          <ImageIcon className="w-6 h-6 text-w-subtle" aria-hidden="true" />
        </div>
      ) : (
        <Image src={src} alt={`Foto galeri ${index + 1}`} fill loading="lazy"
          className={`object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
          onError={() => setError(true)} />
      )}
      {!error && (
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-w-rose/25 flex items-center justify-center"
        >
          <Expand className="w-6 h-6 text-white drop-shadow" aria-hidden="true" />
        </motion.div>
      )}
    </motion.div>
  )
}

export function GallerySection({ photos, isVisible = false }: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openLightbox = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevPhoto = () => setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : null)
  const nextPhoto = () => setLightboxIndex(i => i !== null ? (i + 1) % photos.length : null)

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-w-bgAlt overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-w-border to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">Galeri</p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide">Momen Berharga</h2>
          <FloralDivider variant="rose" className="mt-4 mb-0" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-1.5">
          {photos.map((src, index) => (
            <GalleryItem key={`${src}-${index}`} src={src} index={index}
              isVisible={isVisible} onClick={() => openLightbox(index)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-w-ink/80 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} aria-label="Tutup lightbox"
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center bg-white/90 border border-w-border text-w-body hover:text-w-rose hover:border-w-rose transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-w-rose z-10">
              <X className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevPhoto() }} aria-label="Foto sebelumnya"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/90 border border-w-border text-w-body hover:text-w-rose hover:border-w-rose transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-w-rose z-10">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextPhoto() }} aria-label="Foto berikutnya"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/90 border border-w-border text-w-body hover:text-w-rose hover:border-w-rose transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-w-rose z-10">
              <ChevronRight className="w-4 h-4" />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl max-h-[80vh] mx-16"
              style={{ aspectRatio: '4/3' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={photos[lightboxIndex]} alt={`Foto galeri ${lightboxIndex + 1}`} fill className="object-contain" />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-poppins font-light text-xs tracking-widest">
              {lightboxIndex + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
