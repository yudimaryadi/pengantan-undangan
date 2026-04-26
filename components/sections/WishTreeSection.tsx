'use client'

import { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { safeGetItem, safeSetItem } from '@/lib/storage'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'

interface WishFlower {
  id: string
  name: string
  message: string
  attendance: 'hadir' | 'tidak_hadir'
  x: number
  y: number
  size: number
  color: string
  rotation: number
}

// Pink flowers for "hadir", gold/mauve for "tidak_hadir"
const HADIR_COLORS    = ['#D9A0AE', '#E8B4C0', '#C4788A', '#F2DDE2', '#C49AAA']
const TIDAKHADIR_COLORS = ['#D4B47A', '#E2C99A', '#B8965A', '#C4A8B0', '#9B7285']

const STORAGE_KEY = 'wedding-wish-tree'

function generateFlower(
  name: string,
  message: string,
  attendance: 'hadir' | 'tidak_hadir',
  index: number
): WishFlower {
  const seed = index * 137.508
  const colors = attendance === 'hadir' ? HADIR_COLORS : TIDAKHADIR_COLORS
  return {
    id: `flower-${index}`,
    name,
    message,
    attendance,
    x: 8 + (seed % 84),
    y: 12 + ((seed * 1.618) % 68),
    size: 1 + (index % 3),
    color: colors[index % colors.length],
    rotation: (seed * 2.5) % 360,
  }
}

function FlowerSVG({ size, color, rotation }: { size: number; color: string; rotation: number }) {
  const s = 8 + size * 5
  // Pre-compute petal positions to avoid SSR hydration mismatch
  // [0, 45, 90, 135, 180, 225, 270, 315] * s * 0.7
  const r = s * 0.7
  const petals = [
    { cx: r,           cy: 0,            a: 0   },
    { cx: r * 0.7071,  cy: r * 0.7071,   a: 45  },
    { cx: 0,           cy: r,            a: 90  },
    { cx: -r * 0.7071, cy: r * 0.7071,   a: 135 },
    { cx: -r,          cy: 0,            a: 180 },
    { cx: -r * 0.7071, cy: -r * 0.7071,  a: 225 },
    { cx: 0,           cy: -r,           a: 270 },
    { cx: r * 0.7071,  cy: -r * 0.7071,  a: 315 },
  ]
  return (
    <svg width={s * 2.5} height={s * 2.5} viewBox="-20 -20 40 40" fill="none">
      {petals.map(({ cx, cy, a }) => (
        <ellipse key={a}
          cx={cx} cy={cy}
          rx={s * 0.35} ry={s * 0.55}
          transform={`rotate(${a + rotation}, ${cx}, ${cy})`}
          fill={color} fillOpacity="0.8"
        />
      ))}
      <circle r={s * 0.3} fill={color} />
      <circle r={s * 0.15} fill="#FDF8F5" fillOpacity="0.9" />
    </svg>
  )
}

interface WishTreeSectionProps {
  isVisible?: boolean
  guestName?: string
}

export function WishTreeSection({ isVisible = false, guestName = '' }: WishTreeSectionProps) {
  const [flowers, setFlowers] = useState<WishFlower[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [attendance, setAttendance] = useState<'hadir' | 'tidak_hadir'>('hadir')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Load from localStorage
  useEffect(() => {
    const stored = safeGetItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Array<{
          name: string; message: string; attendance: 'hadir' | 'tidak_hadir'
        }>
        setFlowers(parsed.map((w, i) => generateFlower(w.name, w.message, w.attendance ?? 'hadir', i)))
      } catch { /* ignore */ }
    }
  }, [])

  // Auto-fill name from ?to= param
  useEffect(() => {
    if (guestName) setName(guestName)
  }, [guestName])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Nama tidak boleh kosong.'); return }
    if (!message.trim()) { setError('Ucapan tidak boleh kosong.'); return }

    const stored = safeGetItem(STORAGE_KEY)
    const existing: Array<{ name: string; message: string; attendance: 'hadir' | 'tidak_hadir' }> =
      stored ? JSON.parse(stored) : []

    const updated = [...existing, { name: name.trim(), message: message.trim(), attendance }]
    safeSetItem(STORAGE_KEY, JSON.stringify(updated))

    const newFlower = generateFlower(name.trim(), message.trim(), attendance, flowers.length)
    setFlowers(prev => [...prev, newFlower])
    setMessage('')
    // Keep name (don't reset — tamu mungkin mau kirim lagi)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const hadirCount = flowers.filter(f => f.attendance === 'hadir').length
  const tidakHadirCount = flowers.filter(f => f.attendance === 'tidak_hadir').length

  return (
    <section className="relative py-24 px-6 bg-w-bgAlt overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />
      <FloralCorner position="bottom-left" size="sm" />
      <FloralCorner position="bottom-right" size="sm" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-w-rose-pale/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">
            Ucapan &amp; Konfirmasi
          </p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide mb-2">
            Wish Tree
          </h2>
          <p className="text-w-muted font-poppins font-light text-sm mt-2">
            Tanam bunga doamu 🌸 — hover bunga untuk membaca ucapan
          </p>
          <FloralDivider variant="rose" className="mt-4 mb-0" />
        </motion.div>

        {/* Tree canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full bg-white border border-w-border shadow-card mb-3 overflow-hidden"
          style={{ height: flowers.length > 0 ? '340px' : '180px', transition: 'height 0.6s ease' }}
        >
          {/* Tree SVG */}
          <svg className="absolute bottom-0 left-1/2 -translate-x-1/2" width="140" height="160" viewBox="0 0 140 160" fill="none">
            <path d="M65,160 Q60,115 62,80 Q64,48 70,22" stroke="#A07840" strokeWidth="9" strokeLinecap="round" fill="none" strokeOpacity="0.35" />
            <path d="M62,95 Q35,78 16,66" stroke="#A07840" strokeWidth="4.5" strokeLinecap="round" fill="none" strokeOpacity="0.28" />
            <path d="M64,76 Q88,60 108,50" stroke="#A07840" strokeWidth="4.5" strokeLinecap="round" fill="none" strokeOpacity="0.28" />
            <path d="M65,58 Q50,40 40,28" stroke="#A07840" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.22" />
            <path d="M66,52 Q82,34 95,24" stroke="#A07840" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.22" />
            <path d="M65,160 Q46,154 28,158" stroke="#A07840" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.18" />
            <path d="M65,160 Q82,154 100,158" stroke="#A07840" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.18" />
          </svg>

          {/* Empty state */}
          {flowers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-w-subtle font-poppins font-light text-sm italic text-center px-8">
                Jadilah yang pertama menanam bunga doa 🌱
              </p>
            </div>
          )}

          {/* Flowers */}
          <AnimatePresence>
            {flowers.map((flower) => (
              <motion.div
                key={flower.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                className="absolute cursor-pointer z-10"
                style={{ left: `${flower.x}%`, top: `${flower.y}%`, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setHoveredId(flower.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(hoveredId === flower.id ? null : flower.id)}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5 + flower.size * 0.5, repeat: Infinity, ease: 'easeInOut', delay: flower.size * 0.4 }}
                >
                  <FlowerSVG size={flower.size} color={flower.color} rotation={flower.rotation} />
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredId === flower.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 pointer-events-none"
                      style={{ minWidth: '150px', maxWidth: '210px' }}
                    >
                      <div className="bg-white border border-w-border shadow-card p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <p className="text-w-rose font-poppins font-medium text-xs">{flower.name}</p>
                          {flower.attendance === 'hadir'
                            ? <span className="text-[9px] text-green-600 border border-green-200 bg-green-50 px-1 py-0.5 font-poppins">Hadir</span>
                            : <span className="text-[9px] text-w-rose border border-w-rose/20 bg-w-rose-pale px-1 py-0.5 font-poppins">Tidak Hadir</span>
                          }
                        </div>
                        <p className="text-w-body font-poppins font-light text-xs leading-relaxed">{flower.message}</p>
                      </div>
                      <div className="w-2 h-2 bg-white border-r border-b border-w-border rotate-45 mx-auto -mt-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Stats */}
          {flowers.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              <div className="bg-white/90 border border-w-line px-2 py-1 flex items-center gap-1">
                <span className="text-[10px]">🌸</span>
                <p className="text-w-rose font-poppins font-light text-[10px]">{hadirCount} hadir</p>
              </div>
              {tidakHadirCount > 0 && (
                <div className="bg-white/90 border border-w-line px-2 py-1 flex items-center gap-1">
                  <span className="text-[10px]">🌼</span>
                  <p className="text-w-muted font-poppins font-light text-[10px]">{tidakHadirCount} tidak hadir</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#C4788A' }} />
            <span className="text-w-subtle font-poppins font-light text-[10px]">Bunga pink = Hadir</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#B8965A' }} />
            <span className="text-w-subtle font-poppins font-light text-[10px]">Bunga emas = Tidak Hadir</span>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-w-border p-6 sm:p-8 shadow-soft space-y-5"
        >
          <p className="font-cormorant font-light text-w-ink text-xl tracking-wide text-center">
            Tanam Bunga Doamu
          </p>

          {/* Name */}
          <div>
            <label htmlFor="tree-name" className="block text-w-body font-poppins font-light text-xs tracking-[0.15em] uppercase mb-2">
              Nama Anda
            </label>
            <input id="tree-name" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda" aria-required="true"
              className="w-full min-h-[44px] px-4 py-3 bg-w-bgAlt border border-w-border text-w-ink placeholder-w-subtle font-poppins font-light text-base focus:outline-none focus:border-w-rose/50 transition-colors duration-200"
            />
          </div>

          {/* Attendance */}
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
                <CheckCircle2 className="w-3.5 h-3.5" />
                Hadir
              </button>
              <button type="button" onClick={() => setAttendance('tidak_hadir')}
                aria-pressed={attendance === 'tidak_hadir'} aria-label="Saya tidak dapat hadir"
                className={`flex-1 flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 border font-poppins font-light text-xs tracking-[0.15em] uppercase transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-w-rose ${
                  attendance === 'tidak_hadir'
                    ? 'bg-w-mauve text-white border-w-mauve shadow-soft'
                    : 'bg-white border-w-border text-w-muted hover:border-w-mauve hover:text-w-mauve shadow-soft'
                }`}>
                <XCircle className="w-3.5 h-3.5" />
                Tidak Hadir
              </button>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="tree-message" className="block text-w-body font-poppins font-light text-xs tracking-[0.15em] uppercase mb-2">
              Doa &amp; Ucapan
            </label>
            <textarea id="tree-message" value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan doa dan ucapan terbaik untuk pengantin..."
              rows={4} aria-required="true"
              className="w-full px-4 py-3 bg-w-bgAlt border border-w-border text-w-ink placeholder-w-subtle font-poppins font-light text-base focus:outline-none focus:border-w-rose/50 transition-colors duration-200 resize-none"
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
                🌸 Bunga doamu sudah ditanam di pohon! Terima kasih.
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" aria-label="Tanam bunga doa"
            className="flex items-center justify-center gap-2 w-full min-h-[48px] px-6 py-3 bg-w-rose text-white font-poppins font-medium text-xs tracking-[0.2em] uppercase shadow-rose hover:bg-w-mauve transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-w-rose focus:ring-offset-2">
            <Send className="w-3.5 h-3.5" />
            Tanam Bunga Doa
          </button>
        </motion.form>
      </div>
    </section>
  )
}
