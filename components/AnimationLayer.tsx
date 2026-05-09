'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

interface AnimationLayerProps {
  isActive: boolean
  onComplete: () => void
  coupleImageUrl?: string
}

// ─── Pre-computed fairy lights ────────────────────────────────────────────────
const FAIRY_LIGHTS: { cx: number; cy: number; r: number; op: number }[] = [
  { cx: 4,  cy: 10, r: 2.5, op: 0.75 }, { cx: 10, cy: 6,  r: 2.0, op: 0.55 },
  { cx: 16, cy: 14, r: 3.0, op: 0.80 }, { cx: 22, cy: 8,  r: 2.0, op: 0.60 },
  { cx: 28, cy: 12, r: 2.5, op: 0.70 }, { cx: 34, cy: 5,  r: 2.0, op: 0.50 },
  { cx: 40, cy: 13, r: 3.0, op: 0.80 }, { cx: 46, cy: 7,  r: 2.0, op: 0.60 },
  { cx: 52, cy: 11, r: 2.5, op: 0.70 }, { cx: 58, cy: 4,  r: 2.0, op: 0.50 },
  { cx: 64, cy: 14, r: 3.0, op: 0.80 }, { cx: 70, cy: 8,  r: 2.0, op: 0.60 },
  { cx: 76, cy: 12, r: 2.5, op: 0.70 }, { cx: 82, cy: 6,  r: 2.0, op: 0.55 },
  { cx: 88, cy: 13, r: 3.0, op: 0.80 }, { cx: 94, cy: 9,  r: 2.0, op: 0.60 },
  { cx: 98, cy: 15, r: 2.5, op: 0.70 }, { cx: 7,  cy: 20, r: 1.5, op: 0.40 },
  { cx: 19, cy: 22, r: 2.0, op: 0.55 }, { cx: 31, cy: 18, r: 1.5, op: 0.40 },
  { cx: 43, cy: 21, r: 2.0, op: 0.55 }, { cx: 55, cy: 17, r: 1.5, op: 0.40 },
  { cx: 67, cy: 23, r: 2.0, op: 0.55 }, { cx: 79, cy: 19, r: 1.5, op: 0.40 },
  { cx: 91, cy: 22, r: 2.0, op: 0.55 },
]

// ─── Bokeh ────────────────────────────────────────────────────────────────────
const BOKEH: { id: string; x: number; y: number; r: number; op: number; c: string }[] = [
  { id: 'bk0', x: 8,  y: 15, r: 40, op: 0.04, c: '#C4788A' },
  { id: 'bk1', x: 22, y: 60, r: 55, op: 0.03, c: '#B8965A' },
  { id: 'bk2', x: 40, y: 30, r: 35, op: 0.05, c: '#C4788A' },
  { id: 'bk3', x: 60, y: 70, r: 50, op: 0.03, c: '#D9A0AE' },
  { id: 'bk4', x: 78, y: 20, r: 45, op: 0.04, c: '#B8965A' },
  { id: 'bk5', x: 90, y: 55, r: 38, op: 0.05, c: '#C4788A' },
  { id: 'bk6', x: 15, y: 80, r: 42, op: 0.03, c: '#D9A0AE' },
  { id: 'bk7', x: 50, y: 50, r: 60, op: 0.02, c: '#C4788A' },
  { id: 'bk8', x: 70, y: 85, r: 36, op: 0.04, c: '#B8965A' },
  { id: 'bk9', x: 35, y: 90, r: 48, op: 0.03, c: '#D9A0AE' },
]

// ─── Petals ───────────────────────────────────────────────────────────────────
const PETALS: { id: string; x: number; delay: number; dur: number; size: number; color: string; drift: number }[] = [
  { id: 'pt0',  x: 5,  delay: 0.0,  dur: 4.2, size: 8,  color: '#F2DDE2', drift: 18  },
  { id: 'pt1',  x: 10, delay: 0.3,  dur: 3.8, size: 6,  color: '#D9A0AE', drift: -22 },
  { id: 'pt2',  x: 17, delay: 0.6,  dur: 4.5, size: 10, color: '#E8B4C0', drift: 15  },
  { id: 'pt3',  x: 23, delay: 0.1,  dur: 3.6, size: 7,  color: '#F2DDE2', drift: -18 },
  { id: 'pt4',  x: 30, delay: 0.8,  dur: 4.0, size: 9,  color: '#D4B47A', drift: 20  },
  { id: 'pt5',  x: 37, delay: 0.4,  dur: 3.9, size: 6,  color: '#D9A0AE', drift: -14 },
  { id: 'pt6',  x: 44, delay: 1.0,  dur: 4.3, size: 8,  color: '#E8B4C0', drift: 16  },
  { id: 'pt7',  x: 51, delay: 0.2,  dur: 3.7, size: 10, color: '#F2DDE2', drift: -20 },
  { id: 'pt8',  x: 58, delay: 0.7,  dur: 4.1, size: 7,  color: '#D4B47A', drift: 12  },
  { id: 'pt9',  x: 65, delay: 0.5,  dur: 3.8, size: 9,  color: '#D9A0AE', drift: -16 },
  { id: 'pt10', x: 72, delay: 1.2,  dur: 4.4, size: 6,  color: '#E8B4C0', drift: 22  },
  { id: 'pt11', x: 79, delay: 0.9,  dur: 3.6, size: 8,  color: '#F2DDE2', drift: -12 },
  { id: 'pt12', x: 85, delay: 0.3,  dur: 4.0, size: 10, color: '#D4B47A', drift: 18  },
  { id: 'pt13', x: 91, delay: 1.1,  dur: 3.9, size: 7,  color: '#D9A0AE', drift: -24 },
  { id: 'pt14', x: 14, delay: 1.4,  dur: 4.2, size: 9,  color: '#E8B4C0', drift: 14  },
  { id: 'pt15', x: 27, delay: 1.6,  dur: 3.7, size: 6,  color: '#F2DDE2', drift: -18 },
  { id: 'pt16', x: 42, delay: 1.8,  dur: 4.5, size: 8,  color: '#D4B47A', drift: 20  },
  { id: 'pt17', x: 56, delay: 1.3,  dur: 3.8, size: 10, color: '#D9A0AE', drift: -15 },
  { id: 'pt18', x: 68, delay: 1.5,  dur: 4.1, size: 7,  color: '#E8B4C0', drift: 16  },
  { id: 'pt19', x: 82, delay: 1.7,  dur: 3.6, size: 9,  color: '#F2DDE2', drift: -20 },
]

// ─── SVG Components ───────────────────────────────────────────────────────────

function PetalSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={Math.round(size * 1.6)} viewBox="-8 -12 16 24" fill="none">
      <path d="M0,-11 C4,-7 4,7 0,11 C-4,7 -4,-7 0,-11" fill={color} fillOpacity="0.72" />
    </svg>
  )
}

// ─── Main AnimationLayer ──────────────────────────────────────────────────────

export function AnimationLayer({ isActive, onComplete, coupleImageUrl }: AnimationLayerProps) {
  const onCompleteRef = useRef(onComplete)
  const calledRef     = useRef(false)
  const [showPetals, setShowPetals] = useState(false)
  const [gateOpen,   setGateOpen]   = useState(false)
  const [isMobile,   setIsMobile]   = useState(false)

  const containerControls = useAnimation()
  const sceneControls     = useAnimation()
  const gateLeftControls  = useAnimation()
  const gateRightControls = useAnimation()

  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    if (typeof window !== 'undefined') setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (!isActive) return

    const safeComplete = () => {
      if (!calledRef.current) { calledRef.current = true; onCompleteRef.current() }
    }

    // CSS 3D support check
    const supports3D = (() => {
      if (typeof window === 'undefined') return false
      const el = document.createElement('div')
      el.style.transform = 'rotateY(1deg)'
      return el.style.transform !== ''
    })()

    if (!supports3D) {
      // Wait one frame before calling controls to ensure mount
      const t = setTimeout(() => {
        containerControls.start({ opacity: 0, transition: { duration: 0.4 } }).then(safeComplete)
      }, 50)
      return () => clearTimeout(t)
    }

    const mobile = typeof window !== 'undefined' && window.innerWidth < 768
    const zoomScale = mobile ? 2.5 : 2.8

    // Wait for component to fully mount before starting animations
    const startDelay = setTimeout(() => {
      const run = async () => {
      // Phase 1 (0–0.5s): gate closed, hold
      await new Promise<void>(r => setTimeout(r, 500))

      // Phase 2 (0.5–2.0s): gate opens
      setGateOpen(true)
      await Promise.all([
        gateLeftControls.start({
          x: '-100%',
          transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] },
        }),
        gateRightControls.start({
          x: '100%',
          transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] },
        }),
      ])

      // Phase 3 (2.0–5.0s): camera zoom + petals
      setShowPetals(true)
      await sceneControls.start({
        scale: zoomScale,
        transition: { duration: 3.0, ease: [0.2, 0, 0.4, 1] },
      })

      // Phase 4 (5.0–5.5s): fade out → onComplete
      await containerControls.start({ opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } })
      safeComplete()
    }

    run()
    }, 100) // wait 100ms for mount

    return () => clearTimeout(startDelay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  if (!isActive) return null

  const coupleImg = coupleImageUrl ?? '/images/couple-illustration.png'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 50%, #F5E8E8 100%)',
    }}>
      <motion.div
        animate={containerControls}
        initial={{ opacity: 1 }}
        aria-hidden="true"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 430,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* ── Scene (zooms in during phase 3) ── */}
        <motion.div
          animate={sceneControls}
          initial={{ scale: 1 }}
          style={{
            position: 'absolute', inset: 0,
            transformOrigin: 'center 75%',
          }}
        >
          {/* Background gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #FDF8F5 0%, #FAF0F0 45%, #F5E8E8 75%, #F0E0E4 100%)' }} />

          {/* Bokeh */}
          {BOKEH.map(b => (
            <div key={b.id} style={{
              position: 'absolute',
              left: b.x + '%', top: b.y + '%',
              width: b.r * 2, height: b.r * 2,
              transform: 'translate(-50%,-50%)',
              borderRadius: '50%',
              background: b.c,
              opacity: b.op,
              filter: 'blur(28px)',
              pointerEvents: 'none',
            }} />
          ))}

          {/* Fairy lights */}
          <svg
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '30%', pointerEvents: 'none' }}
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="lightGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E8D4A0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D4B47A" stopOpacity="0" />
              </radialGradient>
            </defs>
            {FAIRY_LIGHTS.map((fl, i) => (
              <g key={i}>
                <circle cx={fl.cx} cy={fl.cy} r={fl.r * 1.8} fill="url(#lightGlow)" />
                <circle cx={fl.cx} cy={fl.cy} r={fl.r * 0.4} fill="#D4B47A" fillOpacity={fl.op} />
              </g>
            ))}
          </svg>

          {/* Background decoration image */}
          <div style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            opacity: 0.85,
            pointerEvents: 'none',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/dekorasi-belakang.png"
              alt=""
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Couple photo */}
          <div style={{
            position: 'absolute',
            bottom: '4%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isMobile ? '55%' : '55%',
            maxWidth: 280,
            zIndex: 10,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coupleImg}
              alt="Pengantin"
              style={{
                width: '100%', height: 'auto', objectFit: 'contain',
                filter: 'drop-shadow(0 8px 24px rgba(196,120,138,0.25))',
                display: 'block',
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        </motion.div>

        {/* ── Gate doors (zIndex 20, above scene) ── */}

        {/* Left gate half */}
        <motion.div
          animate={gateLeftControls}
          initial={{ x: 0 }}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '50%', height: '100%',
            overflow: 'hidden', zIndex: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dekoration.png"
            alt=""
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '200%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'left center',
            }}
          />
        </motion.div>

        {/* Right gate half */}
        <motion.div
          animate={gateRightControls}
          initial={{ x: 0 }}
          style={{
            position: 'absolute', top: 0, right: 0,
            width: '50%', height: '100%',
            overflow: 'hidden', zIndex: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dekoration.png"
            alt=""
            style={{
              position: 'absolute', top: 0, right: 0,
              width: '200%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
            }}
          />
        </motion.div>

        {/* Blur overlay while gate is still closed */}
        {!gateOpen && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 19,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Falling petals (appear after gate opens) */}
        <AnimatePresence>
          {showPetals && PETALS.map(p => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute', left: p.x + '%', top: '-5%',
                zIndex: 40, pointerEvents: 'none',
              }}
              initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
              animate={{
                y: '115vh',
                x: [0, p.drift * 0.4, p.drift, p.drift * 0.7, p.drift * 1.2],
                rotate: [0, 90, 200, 310, 400],
                opacity: [0, 0.8, 0.8, 0.6, 0],
              }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                ease: 'easeIn',
                times: [0, 0.08, 0.5, 0.85, 1],
              }}
            >
              <PetalSVG size={p.size} color={p.color} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
