'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

interface AnimationLayerProps {
  isActive: boolean
  onComplete: () => void
  coupleImageUrl?: string
}

// ─── Pre-computed flower positions (no Math.cos/sin at runtime) ───────────────

// Large foreground flowers — cover screen initially
const FG_FLOWERS = [
  // Left cluster
  { id: 'fl1', x: -8,  y: 10,  s: 1.8, c: '#C4788A', r: -15 },
  { id: 'fl2', x: -5,  y: 35,  s: 1.4, c: '#D9A0AE', r: 20  },
  { id: 'fl3', x: -12, y: 55,  s: 1.6, c: '#E8B4C0', r: -8  },
  { id: 'fl4', x: -3,  y: 72,  s: 1.3, c: '#C4788A', r: 30  },
  { id: 'fl5', x: -10, y: 85,  s: 1.5, c: '#D9A0AE', r: -20 },
  // Right cluster
  { id: 'fr1', x: 92,  y: 8,   s: 1.7, c: '#D9A0AE', r: 10  },
  { id: 'fr2', x: 96,  y: 30,  s: 1.5, c: '#C4788A', r: -25 },
  { id: 'fr3', x: 90,  y: 52,  s: 1.6, c: '#E8B4C0', r: 15  },
  { id: 'fr4', x: 95,  y: 70,  s: 1.4, c: '#C4788A', r: -10 },
  { id: 'fr5', x: 88,  y: 88,  s: 1.3, c: '#D9A0AE', r: 25  },
  // Center top/bottom
  { id: 'fc1', x: 30,  y: -5,  s: 1.2, c: '#E8B4C0', r: 5   },
  { id: 'fc2', x: 50,  y: -8,  s: 1.4, c: '#C4788A', r: -12 },
  { id: 'fc3', x: 70,  y: -4,  s: 1.1, c: '#D9A0AE', r: 18  },
  { id: 'fc4', x: 35,  y: 98,  s: 1.2, c: '#E8B4C0', r: -5  },
  { id: 'fc5', x: 55,  y: 102, s: 1.3, c: '#C4788A', r: 8   },
  { id: 'fc6', x: 72,  y: 96,  s: 1.1, c: '#D9A0AE', r: -18 },
]

// Mid-layer flowers — sides, move slower
const MID_FLOWERS = [
  { id: 'ml1', x: 2,   y: 20,  s: 1.0, c: '#B8965A', r: -10 },
  { id: 'ml2', x: 5,   y: 45,  s: 0.9, c: '#D4B47A', r: 15  },
  { id: 'ml3', x: 1,   y: 68,  s: 1.1, c: '#B8965A', r: -20 },
  { id: 'mr1', x: 85,  y: 18,  s: 1.0, c: '#D4B47A', r: 12  },
  { id: 'mr2', x: 88,  y: 42,  s: 0.9, c: '#B8965A', r: -8  },
  { id: 'mr3', x: 84,  y: 65,  s: 1.1, c: '#D4B47A', r: 22  },
]

// Floating petals
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: `p${i}`,
  x: 5 + (i * 5.5) % 90,
  delay: i * 0.18,
  duration: 3 + (i % 4) * 0.8,
  size: 6 + (i % 3) * 4,
  color: ['#F2DDE2', '#D9A0AE', '#E8B4C0', '#F5E6D3', '#D4B47A'][i % 5],
  drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 3) * 8),
}))

// ─── SVG Rose component (pre-computed, no runtime trig) ───────────────────────
function RoseSVG({ scale = 1, color = '#C4788A' }: { scale?: number; color?: string }) {
  const s = 40 * scale
  // Outer petals: 8 petals at 0,45,90,135,180,225,270,315 deg * radius 14
  const outer = [
    { cx: 14,    cy: 0,     a: 0   },
    { cx: 9.899, cy: 9.899, a: 45  },
    { cx: 0,     cy: 14,    a: 90  },
    { cx:-9.899, cy: 9.899, a: 135 },
    { cx:-14,    cy: 0,     a: 180 },
    { cx:-9.899, cy:-9.899, a: 225 },
    { cx: 0,     cy:-14,    a: 270 },
    { cx: 9.899, cy:-9.899, a: 315 },
  ]
  // Inner petals: 5 petals at 0,72,144,216,288 deg * radius 7
  const inner = [
    { cx: 7,     cy: 0,     a: 0   },
    { cx: 2.163, cy: 6.657, a: 72  },
    { cx:-5.663, cy: 4.114, a: 144 },
    { cx:-5.663, cy:-4.114, a: 216 },
    { cx: 2.163, cy:-6.657, a: 288 },
  ]
  const light = color === '#C4788A' ? '#F2DDE2' : color === '#B8965A' ? '#F5ECD8' : '#FDF8F5'
  return (
    <svg width={s} height={s} viewBox="-22 -22 44 44" fill="none">
      {outer.map(({ cx, cy, a }) => (
        <ellipse key={a} cx={cx} cy={cy} rx="9" ry="13"
          transform={`rotate(${a}, ${cx}, ${cy})`}
          fill={color} fillOpacity="0.75" />
      ))}
      {inner.map(({ cx, cy, a }) => (
        <ellipse key={a} cx={cx} cy={cy} rx="5.5" ry="8.5"
          transform={`rotate(${a}, ${cx}, ${cy})`}
          fill={color} fillOpacity="0.9" />
      ))}
      <circle r="4.5" fill={light} />
      <circle r="2" fill={color} fillOpacity="0.6" />
    </svg>
  )
}

// Leaf SVG
function LeafSVG({ scale = 1 }: { scale?: number }) {
  return (
    <svg width={28 * scale} height={16 * scale} viewBox="0 0 28 16" fill="none">
      <ellipse cx="14" cy="8" rx="13" ry="7" fill="#8A9E6A" fillOpacity="0.55" />
      <line x1="2" y1="8" x2="26" y2="8" stroke="#6A7A4A" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  )
}

// Petal SVG
function PetalSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="-8 -12 16 24" fill="none">
      <path d="M0,-11 C4,-7 4,7 0,11 C-4,7 -4,-7 0,-11"
        fill={color} fillOpacity="0.7" />
    </svg>
  )
}

// ─── Bokeh circles for background depth ──────────────────────────────────────
const BOKEH = Array.from({ length: 12 }, (_, i) => ({
  id: `b${i}`,
  x: 8 + (i * 8.3) % 84,
  y: 5 + (i * 7.7) % 90,
  r: 20 + (i % 4) * 18,
  opacity: 0.04 + (i % 3) * 0.02,
  color: i % 2 === 0 ? '#C4788A' : '#B8965A',
}))

// ─── Couple silhouette fallback SVG ──────────────────────────────────────────
function CoupleSilhouette() {
  return (
    <svg viewBox="0 0 280 380" fill="none" className="w-full h-auto drop-shadow-lg"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(196,120,138,0.2))' }}>

      {/* ── Groom (left) ── */}
      {/* Head */}
      <ellipse cx="95" cy="52" rx="22" ry="26" fill="#F5D5B8" />
      {/* Hair */}
      <ellipse cx="95" cy="34" rx="22" ry="14" fill="#2C1F24" />
      {/* Neck */}
      <rect x="88" y="74" width="14" height="16" rx="4" fill="#F5D5B8" />
      {/* Shirt white */}
      <path d="M78,88 L112,88 L116,160 L74,160 Z" fill="#FAFAFA" />
      {/* Bow tie */}
      <path d="M90,92 L95,97 L100,92 L95,87 Z" fill="#2C1F24" />
      {/* Suit jacket */}
      <path d="M68,88 L78,88 L74,160 L62,160 Z" fill="#2C1F24" />
      <path d="M112,88 L122,88 L118,160 L116,160 Z" fill="#2C1F24" />
      {/* Suit collar */}
      <path d="M78,88 L95,110 L112,88 L105,88 L95,105 L85,88 Z" fill="#2C1F24" />
      {/* Pants */}
      <path d="M74,160 L116,160 L118,280 L106,280 L95,220 L84,280 L72,280 Z" fill="#2C1F24" />
      {/* Left arm */}
      <path d="M68,88 L58,88 L52,160 L64,160 Z" fill="#2C1F24" />
      {/* Right arm — around bride */}
      <path d="M122,88 L132,95 L138,155 L126,158 Z" fill="#2C1F24" />
      {/* Shoes */}
      <ellipse cx="80" cy="284" rx="14" ry="7" fill="#1A1A1A" />
      <ellipse cx="110" cy="284" rx="14" ry="7" fill="#1A1A1A" />

      {/* ── Bride (right) ── */}
      {/* Hijab */}
      <ellipse cx="185" cy="50" rx="26" ry="28" fill="#2C2C2C" />
      {/* Face */}
      <ellipse cx="185" cy="52" rx="18" ry="20" fill="#F5D5B8" />
      {/* Hijab drape */}
      <path d="M159,52 Q162,90 168,110 L202,110 Q208,90 211,52 Q200,72 185,72 Q170,72 159,52 Z" fill="#2C2C2C" />
      {/* Neck */}
      <rect x="178" y="88" width="14" height="14" rx="4" fill="#F5D5B8" />
      {/* Dress bodice */}
      <path d="M162,100 L208,100 L210,170 L160,170 Z" fill="#FAFAFA" />
      {/* Dress skirt — full A-line */}
      <path d="M160,170 L210,170 L230,340 L140,340 Z" fill="#FAFAFA" />
      {/* Dress detail lines */}
      <path d="M185,100 L185,340" stroke="#E8D4D8" strokeWidth="0.8" strokeOpacity="0.5" />
      <path d="M172,120 Q185,130 198,120" stroke="#E8D4D8" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
      {/* Left arm */}
      <path d="M162,100 L148,108 L144,165 L158,168 Z" fill="#FAFAFA" />
      {/* Right arm */}
      <path d="M208,100 L220,108 L224,165 L210,168 Z" fill="#FAFAFA" />
      {/* Shoes */}
      <ellipse cx="162" cy="344" rx="12" ry="6" fill="#F0F0F0" />
      <ellipse cx="208" cy="344" rx="12" ry="6" fill="#F0F0F0" />

      {/* ── Rose accent ── */}
      <circle cx="175" cy="165" r="6" fill="#C4788A" fillOpacity="0.5" />
      <circle cx="175" cy="165" r="3" fill="#D9A0AE" fillOpacity="0.7" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AnimationLayer({ isActive, onComplete, coupleImageUrl }: AnimationLayerProps) {
  const onCompleteRef = useRef(onComplete)
  const calledRef = useRef(false)
  const [phase, setPhase] = useState<'intro' | 'reveal' | 'zoom' | 'gate' | 'done'>('intro')
  const [showPetals, setShowPetals] = useState(false)

  const containerControls = useAnimation()
  const fgLeftControls = useAnimation()
  const fgRightControls = useAnimation()
  const midLeftControls = useAnimation()
  const midRightControls = useAnimation()
  const sceneControls = useAnimation()
  const coupleControls = useAnimation()
  const gateLeftControls = useAnimation()
  const gateRightControls = useAnimation()

  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    if (!isActive) return

    const safeComplete = () => {
      if (!calledRef.current) {
        calledRef.current = true
        onCompleteRef.current()
      }
    }

    const run = async () => {
      // ── Phase 1: Scene appears (0-0.8s) ──────────────────────────────
      setPhase('intro')
      await sceneControls.start({ opacity: 1, transition: { duration: 0.8 } })
      await coupleControls.start({
        opacity: 1, y: 0,
        transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
      })

      // ── Phase 2: Flowers open — parallax (0.8-2.2s) ──────────────────
      setPhase('reveal')
      setShowPetals(true)

      await Promise.all([
        // Foreground flowers sweep out fast
        fgLeftControls.start({
          x: '-120%', opacity: 0,
          transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] },
        }),
        fgRightControls.start({
          x: '120%', opacity: 0,
          transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] },
        }),
        // Mid flowers sweep slower (parallax)
        midLeftControls.start({
          x: '-80%', opacity: 0,
          transition: { duration: 1.4, delay: 0.15, ease: [0.4, 0, 0.2, 1] },
        }),
        midRightControls.start({
          x: '80%', opacity: 0,
          transition: { duration: 1.4, delay: 0.15, ease: [0.4, 0, 0.2, 1] },
        }),
      ])

      // ── Phase 3: Camera zoom in (2.2-3.2s) ───────────────────────────
      setPhase('zoom')
      await sceneControls.start({
        scale: 1.15,
        transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] },
      })

      // ── Phase 4: Gate opens (3.2-4.4s) ───────────────────────────────
      setPhase('gate')
      await Promise.all([
        gateLeftControls.start({
          rotateY: -110, x: '-8%',
          transition: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] },
        }),
        gateRightControls.start({
          rotateY: 110, x: '8%',
          transition: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] },
        }),
      ])

      // ── Phase 5: Fade out (4.4-5.0s) ─────────────────────────────────
      await containerControls.start({
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeIn' },
      })

      setPhase('done')
      safeComplete()
    }

    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  if (!isActive) return null

  const imgSrc = coupleImageUrl || '/images/couple-illustration.png'

  return (
    <motion.div
      animate={containerControls}
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 50%, #F5E8E8 100%)' }}
      aria-hidden="true"
    >
      {/* ── Bokeh background depth ── */}
      <div className="absolute inset-0 pointer-events-none">
        {BOKEH.map(b => (
          <div key={b.id} className="absolute rounded-full"
            style={{
              left: `${b.x}%`, top: `${b.y}%`,
              width: b.r * 2, height: b.r * 2,
              transform: 'translate(-50%, -50%)',
              background: b.color,
              opacity: b.opacity,
              filter: 'blur(24px)',
            }}
          />
        ))}
      </div>

      {/* ── Dot pattern ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1' fill='%23C4788A'/%3E%3C/svg%3E")`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Scene container (zooms in) ── */}
      <motion.div
        animate={sceneControls}
        initial={{ opacity: 0, scale: 1 }}
        className="absolute inset-0 flex items-end justify-center"
        style={{ transformOrigin: 'center 70%' }}
      >
        {/* Ground / grass line */}
        <div className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to top, rgba(196,120,138,0.08), transparent)' }} />

        {/* ── Background garden flowers (static, far layer) ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Far left flowers */}
          {[
            { x: 2,  y: 55, s: 0.55, c: '#E8D4D8' },
            { x: 6,  y: 65, s: 0.45, c: '#F0E0E4' },
            { x: 10, y: 58, s: 0.5,  c: '#E8D4D8' },
          ].map((f, i) => (
            <div key={i} className="absolute" style={{ left: `${f.x}%`, bottom: `${f.y - 50}%` }}>
              <RoseSVG scale={f.s} color={f.c} />
            </div>
          ))}
          {/* Far right flowers */}
          {[
            { x: 88, y: 55, s: 0.55, c: '#E8D4D8' },
            { x: 92, y: 65, s: 0.45, c: '#F0E0E4' },
            { x: 84, y: 58, s: 0.5,  c: '#E8D4D8' },
          ].map((f, i) => (
            <div key={i} className="absolute" style={{ left: `${f.x}%`, bottom: `${f.y - 50}%` }}>
              <RoseSVG scale={f.s} color={f.c} />
            </div>
          ))}
        </div>

        {/* ── Mid-layer flowers (parallax — move slower) ── */}
        <motion.div
          animate={midLeftControls}
          initial={{ x: 0, opacity: 1 }}
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: '22%', zIndex: 15 }}
        >
          {MID_FLOWERS.filter(f => f.x < 50).map(f => (
            <div key={f.id} className="absolute"
              style={{ left: `${f.x * 4}%`, top: `${f.y}%`, transform: `rotate(${f.r}deg)` }}>
              <RoseSVG scale={f.s} color={f.c} />
              <LeafSVG scale={f.s * 0.8} />
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={midRightControls}
          initial={{ x: 0, opacity: 1 }}
          className="absolute right-0 top-0 bottom-0 pointer-events-none"
          style={{ width: '22%', zIndex: 15 }}
        >
          {MID_FLOWERS.filter(f => f.x >= 50).map(f => (
            <div key={f.id} className="absolute"
              style={{ right: `${(100 - f.x) * 4}%`, top: `${f.y}%`, transform: `rotate(${f.r}deg)` }}>
              <RoseSVG scale={f.s} color={f.c} />
              <LeafSVG scale={f.s * 0.8} />
            </div>
          ))}
        </motion.div>

        {/* ── Foreground flowers (cover screen, move fastest) ── */}
        <motion.div
          animate={fgLeftControls}
          initial={{ x: 0, opacity: 1 }}
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: '52%', zIndex: 20 }}
        >
          {FG_FLOWERS.filter(f => f.x < 50).map(f => (
            <div key={f.id} className="absolute"
              style={{ left: `${f.x + 10}%`, top: `${f.y}%`, transform: `rotate(${f.r}deg)` }}>
              <RoseSVG scale={f.s} color={f.c} />
              <LeafSVG scale={f.s * 0.7} />
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={fgRightControls}
          initial={{ x: 0, opacity: 1 }}
          className="absolute right-0 top-0 bottom-0 pointer-events-none"
          style={{ width: '52%', zIndex: 20 }}
        >
          {FG_FLOWERS.filter(f => f.x >= 50).map(f => (
            <div key={f.id} className="absolute"
              style={{ right: `${100 - f.x}%`, top: `${f.y}%`, transform: `rotate(${f.r}deg)` }}>
              <RoseSVG scale={f.s} color={f.c} />
              <LeafSVG scale={f.s * 0.7} />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Falling petals (appear during reveal) ── */}
      <AnimatePresence>
        {showPetals && petals.map(p => (
          <motion.div key={p.id}
            className="absolute pointer-events-none"
            style={{ left: `${p.x}%`, top: '-5%', zIndex: 25 }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: '110vh',
              x: [0, p.drift, p.drift * 0.5, p.drift * 1.3],
              rotate: [0, 180, 360],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeIn',
              times: [0, 0.1, 0.8, 1],
            }}
          >
            <PetalSVG size={p.size} color={p.color} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Gate doors (phase 4) ── */}
      {(phase === 'gate' || phase === 'done') && (
        <div className="absolute inset-0 flex" style={{ perspective: '1200px', zIndex: 30 }}>
          {/* Left gate */}
          <motion.div
            animate={gateLeftControls}
            initial={{ rotateY: 0, x: 0 }}
            className="w-1/2 h-full"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              background: 'linear-gradient(135deg, #F5E8E8 0%, #FDF0F0 50%, #F5E8E8 100%)',
              borderRight: '1px solid rgba(196,120,138,0.2)',
            }}
          >
            {/* Rose decorations on gate */}
            <div className="absolute inset-0 flex flex-col justify-around items-center py-8 opacity-40">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <RoseSVG scale={0.7} color="#C4788A" />
                  <LeafSVG scale={0.6} />
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-6"
              style={{ background: 'linear-gradient(to right, transparent, rgba(196,120,138,0.1))' }} />
          </motion.div>

          {/* Right gate */}
          <motion.div
            animate={gateRightControls}
            initial={{ rotateY: 0, x: 0 }}
            className="w-1/2 h-full"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'right center',
              background: 'linear-gradient(225deg, #F5E8E8 0%, #FDF0F0 50%, #F5E8E8 100%)',
              borderLeft: '1px solid rgba(196,120,138,0.2)',
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-around items-center py-8 opacity-40">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <LeafSVG scale={0.6} />
                  <RoseSVG scale={0.7} color="#C4788A" />
                </div>
              ))}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-6"
              style={{ background: 'linear-gradient(to left, transparent, rgba(196,120,138,0.1))' }} />
          </motion.div>
        </div>
      )}

      {/* ── Center text ── */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute inset-x-0 top-8 flex justify-center pointer-events-none"
            style={{ zIndex: 35 }}
          >
            <p className="font-cormorant text-2xl font-light tracking-[0.3em] italic"
              style={{ color: 'rgba(196,120,138,0.7)' }}>
              The Wedding of
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// petals array used in JSX above
const petals = PETALS
