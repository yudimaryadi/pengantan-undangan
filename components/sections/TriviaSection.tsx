'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, RotateCcw, ChevronRight } from 'lucide-react'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'

interface TriviaQuestion {
  question: string
  options: string[]
  correct: number
  emoji: string
}

const QUESTIONS: TriviaQuestion[] = [
  {
    question: 'Di mana Yudi & Kiki pertama kali bertemu?',
    options: ['Di kampus', 'Di acara pernikahan teman', 'Di media sosial', 'Di tempat kerja'],
    correct: 0,
    emoji: '✨',
  },
  {
    question: 'Bulan berapa mereka mulai dekat?',
    options: ['Maret 2020', 'Juni 2020', 'September 2020', 'Desember 2020'],
    correct: 1,
    emoji: '💬',
  },
  {
    question: 'Di kota mana pernikahan ini dilangsungkan?',
    options: ['Mataram', 'Bima', 'Sumbawa Besar', 'Dompu'],
    correct: 2,
    emoji: '🕌',
  },
  {
    question: 'Apa nama lengkap pengantin pria?',
    options: ['Gabriel Marchel', 'Gabriel Marcel', 'Gabrielle Marchel', 'Gabriel Marsel'],
    correct: 0,
    emoji: '💍',
  },
  {
    question: 'Kapan hari pernikahan Yudi & Kiki?',
    options: ['12 September 2026', '12 Oktober 2026', '12 November 2026', '12 Agustus 2026'],
    correct: 1,
    emoji: '📅',
  },
]

function getBadge(score: number, total: number): { label: string; color: string; emoji: string } {
  const pct = score / total
  if (pct === 1)   return { label: 'Tamu Terbaik!',    color: 'text-yellow-600', emoji: '🏆' }
  if (pct >= 0.8)  return { label: 'Tamu Setia',       color: 'text-w-rose',     emoji: '⭐' }
  if (pct >= 0.6)  return { label: 'Tamu Baik',        color: 'text-w-gold',     emoji: '🌸' }
  return                  { label: 'Coba Lagi Yuk!',   color: 'text-w-muted',    emoji: '💪' }
}

interface PhotoboxTicketSectionProps {
  isVisible?: boolean
}

export function TriviaSection({ isVisible = false }: PhotoboxTicketSectionProps) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answered, setAnswered] = useState(false)

  const q = QUESTIONS[current]
  const badge = getBadge(score, QUESTIONS.length)

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === q.correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current + 1 >= QUESTIONS.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const handleReset = () => {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setAnswered(false)
  }

  return (
    <section className="relative py-24 px-6 bg-w-bg overflow-hidden">
      <FloralCorner position="top-left" size="sm" />
      <FloralCorner position="top-right" size="sm" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-w-gold-pale/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-3">
            Wedding Game
          </p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide mb-2">
            Seberapa Kenal Kamu?
          </h2>
          <FloralDivider variant="gold" className="mt-4 mb-0" />
        </motion.div>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-w-border p-6 sm:p-8 shadow-card"
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-w-subtle font-poppins font-light text-xs">
                  {current + 1} / {QUESTIONS.length}
                </span>
                <div className="flex gap-1">
                  {QUESTIONS.map((_, i) => (
                    <div key={i} className={`w-6 h-1 rounded-full transition-colors duration-300 ${
                      i < current ? 'bg-w-rose' : i === current ? 'bg-w-rose/60' : 'bg-w-line'
                    }`} />
                  ))}
                </div>
                <span className="text-w-rose font-poppins font-medium text-xs">
                  {score} benar
                </span>
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <span className="text-4xl mb-4 block">{q.emoji}</span>
                <p className="text-w-ink font-poppins font-medium text-base sm:text-lg leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {q.options.map((opt, idx) => {
                  let style = 'bg-w-bgAlt border-w-border text-w-body hover:border-w-rose hover:text-w-rose'
                  if (answered) {
                    if (idx === q.correct) style = 'bg-green-50 border-green-400 text-green-700'
                    else if (idx === selected) style = 'bg-red-50 border-red-300 text-red-600'
                    else style = 'bg-w-bgAlt border-w-line text-w-subtle opacity-60'
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      aria-label={`Pilihan ${idx + 1}: ${opt}`}
                      className={`
                        w-full min-h-[48px] px-4 py-3 text-left
                        border font-poppins font-light text-sm
                        transition-all duration-200
                        focus:outline-none focus:ring-1 focus:ring-w-rose
                        disabled:cursor-default
                        ${style}
                      `}
                    >
                      <span className="text-w-subtle mr-2 font-medium">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* Next button */}
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={`text-center text-sm font-poppins font-medium mb-4 ${
                    selected === q.correct ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {selected === q.correct ? '✓ Benar!' : `✗ Jawaban: ${q.options[q.correct]}`}
                  </p>
                  <button
                    onClick={handleNext}
                    aria-label={current + 1 >= QUESTIONS.length ? 'Lihat hasil' : 'Pertanyaan berikutnya'}
                    className="flex items-center justify-center gap-2 w-full min-h-[48px] px-6 py-3 bg-w-rose text-white font-poppins font-medium text-xs tracking-[0.2em] uppercase shadow-rose hover:bg-w-mauve transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-w-rose focus:ring-offset-2"
                  >
                    {current + 1 >= QUESTIONS.length ? 'Lihat Hasil' : 'Berikutnya'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Result screen */
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-w-border p-8 shadow-card text-center"
            >
              <div className="text-6xl mb-4">{badge.emoji}</div>

              <h3 className={`font-cormorant font-light text-3xl mb-2 tracking-wide ${badge.color}`}>
                {badge.label}
              </h3>

              <div className="flex items-center justify-center gap-2 mb-6">
                {Array.from({ length: QUESTIONS.length }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < score ? 'text-yellow-400 fill-yellow-400' : 'text-w-line'}`} />
                ))}
              </div>

              <p className="text-w-body font-poppins font-light text-base mb-2">
                Kamu menjawab <strong className="text-w-rose">{score}</strong> dari <strong>{QUESTIONS.length}</strong> pertanyaan dengan benar!
              </p>

              {score === QUESTIONS.length && (
                <div className="mt-4 mb-6 p-4 bg-yellow-50 border border-yellow-200">
                  <p className="text-yellow-700 font-poppins font-medium text-sm">
                    🎉 Tunjukkan layar ini di venue untuk mendapat hadiah spesial!
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-w-bgAlt border border-w-line mb-6">
                <p className="text-w-subtle font-poppins font-light text-xs">
                  Badge kamu: <span className={`font-medium ${badge.color}`}>{badge.emoji} {badge.label}</span>
                </p>
              </div>

              <button
                onClick={handleReset}
                aria-label="Main lagi"
                className="flex items-center justify-center gap-2 w-full min-h-[48px] px-6 py-3 border border-w-border text-w-muted bg-white font-poppins font-light text-xs tracking-[0.2em] uppercase shadow-soft hover:border-w-rose hover:text-w-rose transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-w-rose"
              >
                <RotateCcw className="w-4 h-4" />
                Main Lagi
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-w-subtle font-poppins font-light text-xs mt-4 italic">
          Tunjukkan badge &quot;Tamu Terbaik&quot; di venue untuk hadiah spesial 🎁
        </p>
      </div>
    </section>
  )
}
