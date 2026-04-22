'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Expand, ImageIcon, X } from 'lucide-react'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { SumbawaBorder } from '../ui/SumbawaBorder'

// Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 13.1, 13.2, 14.2

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.06 }}
      className="relative aspect-square overflow-hidden bg-sumbawa-maroon/10 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Lihat foto ${index + 1}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {error ? (
        /* Placeholder for failed images */
        <div className="w-full h-full flex items-center justify-center bg-sumbawa-maroon/20">
          <ImageIcon className="w-8 h-8 text-sumbawa-gold/40" aria-hidden="true" />
        </div>
      ) : (
        <Image
          src={src}
          alt={`Foto galeri ${index + 1}`}
          fill
          loading="lazy"
          className={`
            object-cover transition-transform duration-500
            ${hovered ? 'scale-110' : 'scale-100'}
          `}
          onError={() => setError(true)}
        />
      )}

      {/* Hover overlay */}
      {!error && (
        <div className={`
          absolute inset-0 bg-sumbawa-maroon/50
          flex items-center justify-center
          transition-opacity duration-300
          ${hovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <Expand className="w-8 h-8 text-sumbawa-gold" aria-hidden="true" />
        </div>
      )}
    </motion.div>
  )
}

export function GallerySection({ photos, isVisible = false }: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-sumbawa-maroon overflow-hidden">
      <SumbawaPattern opacity={0.05} />
      <SumbawaBorder position="top" className="absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sumbawa-gold/70 font-poppins font-light text-xs tracking-[0.3em] uppercase mb-2">
            Galeri
          </p>
          <h2 className="text-sumbawa-ivory font-poppins font-semibold text-2xl sm:text-3xl">
            Momen Berharga
          </h2>
        </motion.div>

        {/* Photo grid: 2 cols mobile, 3 cols md, 4 cols lg */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          {photos.map((src, index) => (
            <GalleryItem
              key={`${src}-${index}`}
              src={src}
              index={index}
              isVisible={isVisible}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
      </div>

      <SumbawaBorder position="bottom" className="absolute bottom-0 left-0 right-0" />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              aria-label="Tutup lightbox"
              className="
                absolute top-4 right-4
                w-11 h-11 flex items-center justify-center
                bg-sumbawa-maroon border border-sumbawa-gold rounded-full
                text-sumbawa-gold hover:bg-sumbawa-gold hover:text-sumbawa-maroon
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-sumbawa-gold
              "
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[lightboxIndex]}
                alt={`Foto galeri ${lightboxIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
