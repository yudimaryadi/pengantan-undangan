'use client'

import { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { safeGetItem, safeSetItem, isLocalStorageAvailable } from '@/lib/storage'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
import { type WishItem } from '@/lib/weddingData'

const STORAGE_KEY = 'wedding-wishes'

function formatTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
  } catch { return iso }
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

  useEffect(() => {
    setStorageAvailable(isLocalStorageAvailable())
    const stored = safeGetItem(STORAGE_KEY)
    if (stored) { try { setWishes(JSON.parse(stored) as WishItem[]) } catch { setWishes([]) } }
  }, [])

  useEffect(() => { if (guestName) setName(guestName) }, [guestName])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Nama tidak boleh kosong.'); return }
    if (!message.trim()) { setError('Pesan ucapan tidak boleh kosong.'); return }
    const newWish: WishItem = { name: name.trim(), message: message.trim(), attendance, timestamp: new Date().toISOString() }
    const updated = [newWish, ...wishes]
    safeSetItem(STORAGE_KEY, JSON.stringify(updated))
    setWishes(updated)
    setMessage('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="relative py-24 px-6 bg-w-bgAlt overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <FloralCorner position="bottom-left" size="sm" />
      <FloralCorner position="bottom-right" size="sm" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-w-rose-pale/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">Ucapan &amp; Konfirmasi</p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide">Kirim Ucapan</h2>
          <FloralDivider variant="rose" className="mt-4 mb-0" />
        </motion.div>

        {!storageAvailable && (
          <div className="flex items-start gap-2 border border-w-border bg-white p-4 mb-6 text-w-muted text-xs font-poppins font-light shadow-soft">
            <AlertCircle className="w-4 h-4 text-w-subtle mt-0.5 flex-shrink-0" />
            <p>Ucapan tidak akan tersimpan setelah halaman ditutup.</p>
          </div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          onSubmit={handleSubmit} noValidate className="mb-12 space-y-4"
        >
          <div>
            <label htmlFor="wish-name" className="block text-w-body font-poppins font-light text-xs tracking-[0.15em] uppercase mb-2">
              Nama Anda
            </label>
            <input id="wish-name" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda" aria-required="true"
              className="w-full min-h-[44px] px-4 py-3 bg-white border border-w-border text-w-ink placeholder-w-subtle font-poppins font-light text-base focus:outline-none focus:border-w-rose/50 shadow-soft transition-colors duration-200"
            />
          </div>

          <div>
            <p className="block text-w-body font-poppins font-light text-xs tracking-[0.15em] uppercase mb-3">
              Konfirmasi Kehadiran
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setAttendance('hadir')}
                aria-pressed={attendance === 'hadir'} aria-label="Saya akan hadir"
                className={`flex-1 flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 border font-poppins font-light text-xs tracking-[0.15em] uppercase transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-w-rose ${
                  attendance === 'hadir'
                    ? 'bg-w-rose text-white border-w-rose shadow-rose'
                    : 'bg-white border-w-border text-w-muted hover:border-w-rose hover:text-w-rose shadow-soft'
                }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />Hadir
              </button>
              <button type="button" onClick={() => setAttendance('tidak_hadir')}
                aria-pressed={attendance === 'tidak_hadir'} aria-label="Saya tidak dapat hadir"
                className={`flex-1 flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 border font-poppins font-light text-xs tracking-[0.15em] uppercase transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-w-rose ${
                  attendance === 'tidak_hadir'
                    ? 'bg-w-mauve text-white border-w-mauve shadow-soft'
                    : 'bg-white border-w-border text-w-muted hover:border-w-mauve hover:text-w-mauve shadow-soft'
                }`}>
                <XCircle className="w-3.5 h-3.5" />Tidak Hadir
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="wish-message" className="block text-w-body font-poppins font-light text-xs tracking-[0.15em] uppercase mb-2">
              Ucapan &amp; Doa
            </label>
            <textarea id="wish-message" value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa terbaik Anda..."
              rows={4} aria-required="true"
              className="w-full px-4 py-3 bg-white border border-w-border text-w-ink placeholder-w-subtle font-poppins font-light text-base focus:outline-none focus:border-w-rose/50 shadow-soft transition-colors duration-200 resize-none"
            />
          </div>

          {error && (
            <p role="alert" className="text-w-rose font-poppins font-light text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
            </p>
          )}

          <AnimatePresence>
            {submitted && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-green-600 font-poppins font-light text-xs flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />Ucapan Anda telah terkirim. Terima kasih!
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" aria-label="Kirim ucapan"
            className="group relative overflow-hidden flex items-center gap-2 min-h-[48px] px-6 py-3 bg-w-rose text-white font-poppins font-medium text-xs tracking-[0.2em] uppercase shadow-rose transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-w-rose focus:ring-offset-2 focus:ring-offset-w-bgAlt hover:bg-w-mauve">
            <Send className="w-3.5 h-3.5" />Kirim Ucapan
          </button>
        </motion.form>

        {wishes.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-w-line" />
              <div className="flex items-center gap-2 text-w-muted">
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-poppins font-light text-xs tracking-widest">{wishes.length} ucapan</span>
              </div>
              <div className="h-px flex-1 bg-w-line" />
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {wishes.map((wish, index) => (
                  <motion.div key={`${wish.timestamp}-${index}`}
                    initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className="bg-white border border-w-line p-4 shadow-soft">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-w-ink font-poppins font-medium text-sm">{wish.name}</p>
                        {wish.attendance === 'hadir' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-poppins">
                            <CheckCircle2 className="w-2.5 h-2.5" />Hadir
                          </span>
                        ) : wish.attendance === 'tidak_hadir' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-w-rose-pale border border-w-border text-w-rose text-[10px] font-poppins">
                            <XCircle className="w-2.5 h-2.5" />Tidak Hadir
                          </span>
                        ) : null}
                      </div>
                      <time dateTime={wish.timestamp} className="text-w-subtle font-poppins font-light text-[10px] flex-shrink-0">
                        {formatTimestamp(wish.timestamp)}
                      </time>
                    </div>
                    <p className="text-w-body font-poppins font-light text-sm leading-relaxed">{wish.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
