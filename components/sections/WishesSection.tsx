'use client'

import { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { SumbawaBorder } from '../ui/SumbawaBorder'
import { safeGetItem, safeSetItem, isLocalStorageAvailable } from '@/lib/storage'
import { type WishItem } from '@/lib/weddingData'

// Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 12.8, 14.6

const STORAGE_KEY = 'wedding-wishes'

function formatTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

interface WishesSectionProps {
  isVisible?: boolean
  guestName?: string
}

export function WishesSection({ isVisible = false, guestName = '' }: WishesSectionProps) {
  const [wishes, setWishes] = useState<WishItem[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [attendance, setAttendance] = useState<'hadir' | 'tidak_hadir'>('hadir')
  const [error, setError] = useState('')
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  // Load wishes from localStorage on mount
  useEffect(() => {
    const available = isLocalStorageAvailable()
    setStorageAvailable(available)

    const stored = safeGetItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WishItem[]
        setWishes(parsed)
      } catch {
        setWishes([])
      }
    }
  }, [])

  // Auto-fill nama dari ?to= param
  useEffect(() => {
    if (guestName) {
      setName(guestName)
    }
  }, [guestName])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Nama tidak boleh kosong.')
      return
    }
    if (!message.trim()) {
      setError('Pesan ucapan tidak boleh kosong.')
      return
    }

    const newWish: WishItem = {
      name: name.trim(),
      message: message.trim(),
      attendance,
      timestamp: new Date().toISOString(),
    }

    const updated = [newWish, ...wishes]
    safeSetItem(STORAGE_KEY, JSON.stringify(updated))
    setWishes(updated)
    setMessage('')
    // Pertahankan nama (tidak di-reset) agar tamu tidak perlu isi ulang
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="relative py-20 px-6 bg-sumbawa-forest overflow-hidden">
      <SumbawaPattern opacity={0.05} />
      <SumbawaBorder position="top" className="absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sumbawa-gold/70 font-poppins font-light text-xs tracking-[0.3em] uppercase mb-2">
            Ucapan &amp; Konfirmasi
          </p>
          <h2 className="text-sumbawa-ivory font-poppins font-semibold text-2xl sm:text-3xl">
            Kirim Ucapan
          </h2>
        </motion.div>

        {/* Storage unavailable notice */}
        {!storageAvailable && (
          <div className="flex items-start gap-2 bg-sumbawa-maroon/50 border border-sumbawa-gold/30 p-4 mb-6 text-sumbawa-ivory/80 text-sm font-poppins font-light">
            <AlertCircle className="w-4 h-4 text-sumbawa-gold mt-0.5 flex-shrink-0" />
            <p>Ucapan Anda tidak akan tersimpan setelah halaman ditutup karena penyimpanan lokal tidak tersedia.</p>
          </div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          noValidate
          className="mb-10"
        >
          {/* Name input */}
          <div className="mb-4">
            <label
              htmlFor="wish-name"
              className="block text-sumbawa-gold font-poppins font-medium text-sm mb-2"
            >
              Nama Anda
            </label>
            <input
              id="wish-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              aria-required="true"
              className="
                w-full min-h-[44px] px-4 py-3
                bg-sumbawa-ivory/10 border border-sumbawa-gold/40
                text-sumbawa-ivory placeholder-sumbawa-ivory/40
                font-poppins font-light text-base
                focus:outline-none focus:border-sumbawa-gold focus:bg-sumbawa-ivory/15
                transition-colors duration-200
              "
            />
          </div>

          {/* Attendance option */}
          <div className="mb-4">
            <p className="block text-sumbawa-gold font-poppins font-medium text-sm mb-3">
              Konfirmasi Kehadiran
            </p>
            <div className="flex gap-3">
              {/* Hadir */}
              <button
                type="button"
                onClick={() => setAttendance('hadir')}
                aria-pressed={attendance === 'hadir'}
                aria-label="Saya akan hadir"
                className={`
                  flex-1 flex items-center justify-center gap-2
                  min-h-[48px] px-4 py-3
                  border-2 font-poppins font-medium text-sm tracking-wide
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-sumbawa-gold
                  ${attendance === 'hadir'
                    ? 'bg-sumbawa-gold border-sumbawa-gold text-sumbawa-maroon'
                    : 'bg-transparent border-sumbawa-gold/40 text-sumbawa-ivory/70 hover:border-sumbawa-gold hover:text-sumbawa-ivory'
                  }
                `}
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Hadir
              </button>

              {/* Tidak Hadir */}
              <button
                type="button"
                onClick={() => setAttendance('tidak_hadir')}
                aria-pressed={attendance === 'tidak_hadir'}
                aria-label="Saya tidak dapat hadir"
                className={`
                  flex-1 flex items-center justify-center gap-2
                  min-h-[48px] px-4 py-3
                  border-2 font-poppins font-medium text-sm tracking-wide
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-sumbawa-gold
                  ${attendance === 'tidak_hadir'
                    ? 'bg-sumbawa-maroon border-sumbawa-maroon text-sumbawa-ivory'
                    : 'bg-transparent border-sumbawa-gold/40 text-sumbawa-ivory/70 hover:border-sumbawa-gold hover:text-sumbawa-ivory'
                  }
                `}
              >
                <XCircle className="w-4 h-4 flex-shrink-0" />
                Tidak Hadir
              </button>
            </div>
          </div>

          {/* Message textarea */}
          <div className="mb-4">
            <label
              htmlFor="wish-message"
              className="block text-sumbawa-gold font-poppins font-medium text-sm mb-2"
            >
              Ucapan &amp; Doa
            </label>
            <textarea
              id="wish-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa terbaik Anda..."
              rows={4}
              aria-required="true"
              className="
                w-full px-4 py-3
                bg-sumbawa-ivory/10 border border-sumbawa-gold/40
                text-sumbawa-ivory placeholder-sumbawa-ivory/40
                font-poppins font-light text-base
                focus:outline-none focus:border-sumbawa-gold focus:bg-sumbawa-ivory/15
                transition-colors duration-200
                resize-none
              "
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              id="wish-error"
              role="alert"
              className="text-red-300 font-poppins font-light text-sm mb-4 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}

          {/* Success message */}
          <AnimatePresence>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-300 font-poppins font-light text-sm mb-4"
              >
                ✓ Ucapan Anda telah terkirim. Terima kasih!
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            type="submit"
            aria-label="Kirim ucapan"
            className="
              flex items-center gap-2
              min-h-[48px] px-6 py-3
              bg-sumbawa-gold text-sumbawa-maroon
              font-poppins font-semibold text-sm tracking-widest uppercase
              hover:bg-sumbawa-gold/90
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-sumbawa-gold focus:ring-offset-2 focus:ring-offset-sumbawa-forest
            "
          >
            <Send className="w-4 h-4" />
            Kirim Ucapan
          </button>
        </motion.form>

        {/* Wishes list */}
        {wishes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-sumbawa-gold" aria-hidden="true" />
              <h3 className="text-sumbawa-ivory font-poppins font-medium text-base">
                {wishes.length} Ucapan
              </h3>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {wishes.map((wish, index) => (
                  <motion.div
                    key={`${wish.timestamp}-${index}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-sumbawa-ivory/10 border border-sumbawa-gold/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sumbawa-gold font-poppins font-medium text-sm">
                          {wish.name}
                        </p>
                        {/* Attendance badge */}
                        {wish.attendance === 'hadir' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sumbawa-gold/20 border border-sumbawa-gold/40 text-sumbawa-gold text-xs font-poppins font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Hadir
                          </span>
                        ) : wish.attendance === 'tidak_hadir' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sumbawa-maroon/40 border border-sumbawa-maroon/60 text-sumbawa-ivory/70 text-xs font-poppins font-medium">
                            <XCircle className="w-3 h-3" />
                            Tidak Hadir
                          </span>
                        ) : null}
                      </div>
                      <time
                        dateTime={wish.timestamp}
                        className="text-sumbawa-ivory/40 font-poppins font-light text-xs flex-shrink-0"
                      >
                        {formatTimestamp(wish.timestamp)}
                      </time>
                    </div>
                    <p className="text-sumbawa-ivory/80 font-poppins font-light text-sm leading-relaxed">
                      {wish.message}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <SumbawaBorder position="bottom" className="absolute bottom-0 left-0 right-0" />
    </section>
  )
}
