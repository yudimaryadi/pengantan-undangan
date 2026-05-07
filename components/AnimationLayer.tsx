'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

interface AnimationLayerProps {
  isActive: boolean
  onComplete: () => void
  coupleImageUrl?: string
}

// ─── Pre-computed rose outer petals (8 petals, r=14) ─────────────────────────
const ROSE_OUTER_PETALS: { cx: number; cy: number; a: number }[] = [
  { cx: 14,      cy: 0,      a: 0   },
  { cx: 9.899,   cy: 9.899,  a: 45  },
  { cx: 0,       cy: 14,     a: 90  },
  { cx: -9.899,  cy: 9.899,  a: 135 },
  { cx: -14,     cy: 0,      a: 180 },
  { cx: -9.899,  cy: -9.899, a: 225 },
  { cx: 0,       cy: -14,    a: 270 },
  { cx: 9.899,   cy: -9.899, a: 315 },
]

const ROSE_INNER_PETALS: { cx: number; cy: number; a: number }[] = [
  { cx: 7,      cy: 0,      a: 0   },
  { cx: 2.163,  cy: 6.657,  a: 72  },
  { cx: -5.663, cy: 4.114,  a: 144 },
  { cx: -5.663, cy: -4.114, a: 216 },
  { cx: 2.163,  cy: -6.657, a: 288 },
]

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

// ─── Aisle flowers ────────────────────────────────────────────────────────────
const AISLE_LEFT: { id: string; x: number; bot: number; sc: number; c: string; sd: number }[] = [
  { id: 'al0',  x: 2,  bot: 5,  sc: 1.0, c: '#C4788A', sd: 0.0 },
  { id: 'al1',  x: 6,  bot: 8,  sc: 0.6, c: '#D9A0AE', sd: 0.3 },
  { id: 'al2',  x: 10, bot: 4,  sc: 1.4, c: '#E8B4C0', sd: 0.6 },
  { id: 'al3',  x: 14, bot: 10, sc: 0.6, c: '#C4788A', sd: 0.9 },
  { id: 'al4',  x: 4,  bot: 18, sc: 1.0, c: '#D9A0AE', sd: 0.2 },
  { id: 'al5',  x: 8,  bot: 22, sc: 1.4, c: '#E8B4C0', sd: 0.5 },
  { id: 'al6',  x: 12, bot: 15, sc: 1.0, c: '#C4788A', sd: 0.8 },
  { id: 'al7',  x: 3,  bot: 28, sc: 0.6, c: '#D9A0AE', sd: 0.1 },
  { id: 'al8',  x: 7,  bot: 32, sc: 1.4, c: '#C4788A', sd: 0.4 },
  { id: 'al9',  x: 11, bot: 26, sc: 1.0, c: '#E8B4C0', sd: 0.7 },
  { id: 'al10', x: 5,  bot: 36, sc: 0.6, c: '#D9A0AE', sd: 1.0 },
  { id: 'al11', x: 9,  bot: 40, sc: 1.4, c: '#C4788A', sd: 0.3 },
]
const AISLE_RIGHT: { id: string; x: number; bot: number; sc: number; c: string; sd: number }[] = [
  { id: 'ar0',  x: 98, bot: 5,  sc: 1.0, c: '#D9A0AE', sd: 0.1 },
  { id: 'ar1',  x: 94, bot: 8,  sc: 0.6, c: '#C4788A', sd: 0.4 },
  { id: 'ar2',  x: 90, bot: 4,  sc: 1.4, c: '#E8B4C0', sd: 0.7 },
  { id: 'ar3',  x: 86, bot: 10, sc: 0.6, c: '#D9A0AE', sd: 1.0 },
  { id: 'ar4',  x: 96, bot: 18, sc: 1.0, c: '#C4788A', sd: 0.3 },
  { id: 'ar5',  x: 92, bot: 22, sc: 1.4, c: '#E8B4C0', sd: 0.6 },
  { id: 'ar6',  x: 88, bot: 15, sc: 1.0, c: '#D9A0AE', sd: 0.9 },
  { id: 'ar7',  x: 97, bot: 28, sc: 0.6, c: '#C4788A', sd: 0.2 },
  { id: 'ar8',  x: 93, bot: 32, sc: 1.4, c: '#D9A0AE', sd: 0.5 },
  { id: 'ar9',  x: 89, bot: 26, sc: 1.0, c: '#E8B4C0', sd: 0.8 },
  { id: 'ar10', x: 95, bot: 36, sc: 0.6, c: '#C4788A', sd: 0.1 },
  { id: 'ar11', x: 91, bot: 40, sc: 1.4, c: '#D9A0AE', sd: 0.4 },
]
const NEAR_LEFT: { id: string; x: number; bot: number; sc: number; c: string; sd: number }[] = [
  { id: 'nl0', x: 0,  bot: 0, sc: 2.0, c: '#C4788A', sd: 0.0 },
  { id: 'nl1', x: 5,  bot: 2, sc: 1.8, c: '#D9A0AE', sd: 0.4 },
  { id: 'nl2', x: 10, bot: 0, sc: 2.2, c: '#E8B4C0', sd: 0.8 },
  { id: 'nl3', x: 2,  bot: 5, sc: 1.9, c: '#C4788A', sd: 0.2 },
  { id: 'nl4', x: 7,  bot: 3, sc: 2.1, c: '#D9A0AE', sd: 0.6 },
  { id: 'nl5', x: 12, bot: 1, sc: 1.8, c: '#E8B4C0', sd: 1.0 },
]
const NEAR_RIGHT: { id: string; x: number; bot: number; sc: number; c: string; sd: number }[] = [
  { id: 'nr0', x: 100, bot: 0, sc: 2.0, c: '#D9A0AE', sd: 0.2 },
  { id: 'nr1', x: 95,  bot: 2, sc: 1.8, c: '#C4788A', sd: 0.6 },
  { id: 'nr2', x: 90,  bot: 0, sc: 2.2, c: '#E8B4C0', sd: 1.0 },
  { id: 'nr3', x: 98,  bot: 5, sc: 1.9, c: '#D9A0AE', sd: 0.3 },
  { id: 'nr4', x: 93,  bot: 3, sc: 2.1, c: '#C4788A', sd: 0.7 },
  { id: 'nr5', x: 88,  bot: 1, sc: 1.8, c: '#E8B4C0', sd: 0.1 },
]

// ─── SVG Components ───────────────────────────────────────────────────────────

function RoseSVG({ scale = 1, color = '#C4788A' }: { scale?: number; color?: string }) {
  const dim = Math.round(44 * scale)
  const lightColor = color === '#B8965A' || color === '#D4B47A' ? '#F5ECD8' : '#FDF8F5'
  return (
    <svg width={dim} height={dim} viewBox="-22 -22 44 44" fill="none">
      {ROSE_OUTER_PETALS.map(({ cx, cy, a }) => (
        <ellipse key={'o' + a} cx={cx} cy={cy} rx="9" ry="13"
          transform={'rotate(' + a + ',' + cx + ',' + cy + ')'} fill={color} fillOpacity="0.72" />
      ))}
      {ROSE_INNER_PETALS.map(({ cx, cy, a }) => (
        <ellipse key={'i' + a} cx={cx} cy={cy} rx="5.5" ry="8.5"
          transform={'rotate(' + a + ',' + cx + ',' + cy + ')'} fill={color} fillOpacity="0.88" />
      ))}
      <circle r="4.5" fill={lightColor} />
      <circle r="2" fill={color} fillOpacity="0.55" />
    </svg>
  )
}

function PetalSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={Math.round(size * 1.6)} viewBox="-8 -12 16 24" fill="none">
      <path d="M0,-11 C4,-7 4,7 0,11 C-4,7 -4,-7 0,-11" fill={color} fillOpacity="0.72" />
    </svg>
  )
}

function FlowerStemSVG({ scale = 1, color = '#C4788A', swayDelay = 0 }: {
  scale?: number; color?: string; swayDelay?: number
}) {
  const h = Math.round(120 * scale)
  const w = Math.round(50 * scale)
  return (
    <motion.div
      style={{ width: w, height: h, position: 'relative', transformOrigin: 'bottom center' }}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: swayDelay }}
    >
      <svg width={w} height={h} viewBox="0 0 50 120" fill="none">
        <line x1="25" y1="115" x2="25" y2="30" stroke="#8A9E6A" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="14" cy="78" rx="12" ry="6" transform="rotate(-30,14,78)" fill="#8A9E6A" fillOpacity="0.6" />
        <line x1="14" y1="78" x2="25" y2="72" stroke="#6A7A4A" strokeWidth="0.8" strokeOpacity="0.4" />
        <ellipse cx="36" cy="62" rx="12" ry="6" transform="rotate(30,36,62)" fill="#6A7A4A" fillOpacity="0.55" />
        <line x1="36" y1="62" x2="25" y2="58" stroke="#6A7A4A" strokeWidth="0.8" strokeOpacity="0.4" />
        <ellipse cx="18" cy="50" rx="8" ry="4" transform="rotate(-20,18,50)" fill="#A8C080" fillOpacity="0.45" />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
        <RoseSVG scale={scale * 0.75} color={color} />
      </div>
    </motion.div>
  )
}

function WeddingArchSVG() {
  return (
    <svg width="300" height="320" viewBox="0 0 300 320" fill="none">
      <rect x="18" y="85" width="18" height="235" rx="9" fill="#D4B47A" fillOpacity="0.55" />
      <rect x="264" y="85" width="18" height="235" rx="9" fill="#D4B47A" fillOpacity="0.55" />
      <rect x="22" y="90" width="6" height="225" rx="3" fill="#E8D4A0" fillOpacity="0.35" />
      <rect x="268" y="90" width="6" height="225" rx="3" fill="#E8D4A0" fillOpacity="0.35" />
      <path d="M36,85 Q150,-30 264,85" stroke="#D4B47A" strokeWidth="14" strokeLinecap="round" fill="none" strokeOpacity="0.60" />
      <path d="M42,88 Q150,-18 258,88" stroke="#E8D4A0" strokeWidth="5" strokeLinecap="round" fill="none" strokeOpacity="0.45" />
      <path d="M36,85 Q90,60 150,55 Q210,60 264,85" stroke="#F2DDE2" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.50" strokeDasharray="8,4" />
      <circle cx="150" cy="14" r="12" fill="#C4788A" fillOpacity="0.50" />
      <circle cx="150" cy="14" r="6"  fill="#F2DDE2" fillOpacity="0.65" />
      <circle cx="138" cy="20" r="8"  fill="#D9A0AE" fillOpacity="0.45" />
      <circle cx="162" cy="20" r="8"  fill="#D9A0AE" fillOpacity="0.45" />
      <circle cx="90"  cy="32" r="10" fill="#C4788A" fillOpacity="0.48" />
      <circle cx="90"  cy="32" r="5"  fill="#F2DDE2" fillOpacity="0.60" />
      <circle cx="78"  cy="40" r="7"  fill="#E8B4C0" fillOpacity="0.45" />
      <circle cx="66"  cy="55" r="9"  fill="#D9A0AE" fillOpacity="0.48" />
      <circle cx="66"  cy="55" r="4.5" fill="#F2DDE2" fillOpacity="0.60" />
      <circle cx="52"  cy="72" r="8"  fill="#C4788A" fillOpacity="0.45" />
      <circle cx="210" cy="32" r="10" fill="#C4788A" fillOpacity="0.48" />
      <circle cx="210" cy="32" r="5"  fill="#F2DDE2" fillOpacity="0.60" />
      <circle cx="222" cy="40" r="7"  fill="#E8B4C0" fillOpacity="0.45" />
      <circle cx="234" cy="55" r="9"  fill="#D9A0AE" fillOpacity="0.48" />
      <circle cx="234" cy="55" r="4.5" fill="#F2DDE2" fillOpacity="0.60" />
      <circle cx="248" cy="72" r="8"  fill="#C4788A" fillOpacity="0.45" />
      <circle cx="27"  cy="83" r="9"  fill="#C4788A" fillOpacity="0.50" />
      <circle cx="27"  cy="83" r="4.5" fill="#F2DDE2" fillOpacity="0.60" />
      <circle cx="273" cy="83" r="9"  fill="#C4788A" fillOpacity="0.50" />
      <circle cx="273" cy="83" r="4.5" fill="#F2DDE2" fillOpacity="0.60" />
      {FAIRY_LIGHTS.slice(0, 8).map((fl, i) => (
        <circle key={i} cx={fl.cx * 2.6} cy={fl.cy * 1.2} r={fl.r} fill="#D4B47A" fillOpacity={fl.op * 0.6} />
      ))}
    </svg>
  )
}

function GateFlowers({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'right' ? 'scale(-1,1)' : undefined
  return (
    <svg viewBox="0 0 200 700" className="absolute inset-0 w-full h-full" style={{ transform: flip }} fill="none">
      <rect x="96" y="0" width="4" height="700" fill="#C9A96E" fillOpacity="0.5" />
      <rect x="94" y="0" width="1" height="700" fill="#E2C99A" fillOpacity="0.3" />
      {[80, 200, 340, 480, 600].map((y) => (
        <g key={y}>
          <rect x="10" y={y - 1} width="180" height="2" fill="#C9A96E" fillOpacity="0.4" />
          <path d={'M98,' + (y - 7) + ' L105,' + y + ' L98,' + (y + 7) + ' L91,' + y + ' Z'} fill="#C9A96E" fillOpacity="0.7" />
        </g>
      ))}
      <g transform="translate(98, 55)">
        {ROSE_OUTER_PETALS.map(({ cx, cy, a }) => (
          <ellipse key={a} cx={cx * 1.1} cy={cy * 1.1} rx="10" ry="14"
            transform={'rotate(' + a + ',' + (cx * 1.1) + ',' + (cy * 1.1) + ')'} fill="#D4A5A5" fillOpacity="0.85" />
        ))}
        {ROSE_INNER_PETALS.map(({ cx, cy, a }) => (
          <ellipse key={a} cx={cx * 1.1} cy={cy * 1.1} rx="6" ry="9"
            transform={'rotate(' + a + ',' + (cx * 1.1) + ',' + (cy * 1.1) + ')'} fill="#E8B4B4" fillOpacity="0.9" />
        ))}
        <circle r="4" fill="#F0D5C8" /><circle r="2" fill="#E8C4A0" />
      </g>
      <path d="M98,80 C85,120 110,160 95,200 C80,240 105,280 98,340" stroke="#5A7A3A" strokeWidth="2" strokeOpacity="0.6" fill="none" />
      {[{ x: 88, y: 110, r: -30 }, { x: 108, y: 145, r: 25 }, { x: 82, y: 175, r: -40 }, { x: 112, y: 215, r: 35 }, { x: 85, y: 255, r: -25 }, { x: 108, y: 295, r: 30 }].map((leaf, i) => (
        <g key={i} transform={'translate(' + leaf.x + ',' + leaf.y + ') rotate(' + leaf.r + ')'}>
          <ellipse rx="10" ry="5" fill="#6B8C4A" fillOpacity="0.65" />
        </g>
      ))}
      <g transform="translate(55, 160)">
        {ROSE_INNER_PETALS.map(({ cx, cy, a }) => (
          <ellipse key={a} cx={cx * 1.3} cy={cy * 1.3} rx="6" ry="9"
            transform={'rotate(' + a + ',' + (cx * 1.3) + ',' + (cy * 1.3) + ')'} fill="#E8B4B4" fillOpacity="0.8" />
        ))}
        <circle r="3" fill="#F0D5C8" />
      </g>
      <g transform="translate(145, 230)">
        {ROSE_INNER_PETALS.map(({ cx, cy, a }) => (
          <ellipse key={a} cx={cx} cy={cy} rx="5" ry="8"
            transform={'rotate(' + a + ',' + cx + ',' + cy + ')'} fill="#D4A5A5" fillOpacity="0.8" />
        ))}
        <circle r="3" fill="#F0D5C8" />
      </g>
      <g transform="translate(98, 340)">
        {ROSE_OUTER_PETALS.map(({ cx, cy, a }) => (
          <ellipse key={a} cx={cx} cy={cy} rx="8" ry="12"
            transform={'rotate(' + a + ',' + cx + ',' + cy + ')'} fill="#E8C4D4" fillOpacity="0.85" />
        ))}
        {ROSE_INNER_PETALS.map(({ cx, cy, a }) => (
          <ellipse key={a} cx={cx} cy={cy} rx="5" ry="8"
            transform={'rotate(' + a + ',' + cx + ',' + cy + ')'} fill="#F5D4E0" fillOpacity="0.9" />
        ))}
        <circle r="4" fill="#F5E6D3" /><circle r="2" fill="#E8C99A" />
      </g>
      <path d="M98,365 C88,400 112,430 95,470 C80,510 108,540 98,580" stroke="#5A7A3A" strokeWidth="2" strokeOpacity="0.5" fill="none" />
      {[{ x: 85, y: 390, r: -35 }, { x: 112, y: 425, r: 30 }, { x: 82, y: 460, r: -28 }, { x: 110, y: 500, r: 40 }].map((leaf, i) => (
        <g key={i} transform={'translate(' + leaf.x + ',' + leaf.y + ') rotate(' + leaf.r + ')'}>
          <ellipse rx="9" ry="4.5" fill="#6B8C4A" fillOpacity="0.6" />
        </g>
      ))}
      <g transform="translate(98, 610)">
        {ROSE_OUTER_PETALS.map(({ cx, cy, a }) => (
          <ellipse key={a} cx={cx * 0.85} cy={cy * 0.85} rx="7" ry="11"
            transform={'rotate(' + a + ',' + (cx * 0.85) + ',' + (cy * 0.85) + ')'} fill="#D4A5A5" fillOpacity="0.8" />
        ))}
        <circle r="3.5" fill="#F0D5C8" />
      </g>
      {[{ x: 70, y: 90 }, { x: 130, y: 120 }, { x: 45, y: 200 }, { x: 155, y: 170 }, { x: 65, y: 370 }, { x: 140, y: 410 }, { x: 50, y: 480 }, { x: 150, y: 530 }].map((p, i) => (
        <path key={i} transform={'translate(' + p.x + ',' + p.y + ')'} d="M0,-4 L0.7,-0.7 L4,0 L0.7,0.7 L0,4 L-0.7,0.7 L-4,0 L-0.7,-0.7 Z" fill="#C9A96E" fillOpacity="0.5" />
      ))}
    </svg>
  )
}

// ─── Background Scene ─────────────────────────────────────────────────────────

function BackgroundScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #FDF8F5 0%, #FAF0F0 45%, #F5E8E8 75%, #F0E0E4 100%)' }} />
      {BOKEH.map(b => (
        <div key={b.id} style={{ position: 'absolute', left: b.x + '%', top: b.y + '%', width: b.r * 2, height: b.r * 2, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: b.c, opacity: b.op, filter: 'blur(28px)', pointerEvents: 'none' }} />
      ))}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '30%', pointerEvents: 'none' }} viewBox="0 0 100 30" preserveAspectRatio="none">
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
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: 'linear-gradient(to top, rgba(138,158,106,0.14) 0%, rgba(196,120,138,0.07) 50%, transparent 100%)' }} />
      <div style={{ position: 'absolute', bottom: '18%', left: '50%', transform: 'translateX(-50%)', opacity: 0.68 }}>
        <WeddingArchSVG />
      </div>
    </div>
  )
}

// ─── Main AnimationLayer ──────────────────────────────────────────────────────

export function AnimationLayer({ isActive, onComplete, coupleImageUrl }: AnimationLayerProps) {
  const onCompleteRef = useRef(onComplete)
  const calledRef = useRef(false)
  const [phase, setPhase] = useState<'gate' | 'walk' | 'petals' | 'done'>('gate')
  const [showPetals, setShowPetals] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const containerControls  = useAnimation()
  const sceneControls      = useAnimation()
  const gateLeftControls   = useAnimation()
  const gateRightControls  = useAnimation()
  const aisleLeftControls  = useAnimation()
  const aisleRightControls = useAnimation()
  const nearLeftControls   = useAnimation()
  const nearRightControls  = useAnimation()
  const coupleControls     = useAnimation()

  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    if (typeof window !== 'undefined') setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (!isActive) return
    const safeComplete = () => {
      if (!calledRef.current) { calledRef.current = true; onCompleteRef.current() }
    }
    const supports3D = (() => {
      if (typeof window === 'undefined') return false
      const el = document.createElement('div')
      el.style.transform = 'rotateY(1deg)'
      return el.style.transform !== ''
    })()
    if (!supports3D) { containerControls.start({ opacity: 0, transition: { duration: 0.4 } }).then(safeComplete); return }

    const mobile = typeof window !== 'undefined' && window.innerWidth < 768
    const zoomScale = mobile ? 2.8 : 3.5

    const run = async () => {
      setPhase('gate')
      await new Promise(r => setTimeout(r, 500))
      setGateOpen(true)
      setShowPetals(true)
      await Promise.all([
        gateLeftControls.start({ rotateY: -110, transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
        gateRightControls.start({ rotateY: 110, transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
      ])
      setPhase('walk')
      await Promise.all([
        sceneControls.start({ scale: zoomScale, transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] } }),
        aisleLeftControls.start({ x: '-55%', transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] } }),
        aisleRightControls.start({ x: '55%', transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] } }),
        nearLeftControls.start({ x: '-90%', transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] } }),
        nearRightControls.start({ x: '90%', transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] } }),
        coupleControls.start({ scale: 1.08, transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] } }),
      ])
      setPhase('petals')
      await containerControls.start({ opacity: 0, transition: { duration: 0.8, ease: 'easeIn' } })
      setPhase('done')
      safeComplete()
    }
    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  if (!isActive) return null

  const coupleImg = coupleImageUrl ?? '/images/couple-illustration.png'
  const transformOrigin = isMobile ? 'center 80%' : 'center 72%'

  return (
    <motion.div animate={containerControls} initial={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, zIndex: 50, overflow: 'hidden', background: 'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 50%, #F5E8E8 100%)' }}
      aria-hidden="true">

      {/* Scene zooms in */}
      <motion.div animate={sceneControls} initial={{ scale: 1 }}
        style={{ position: 'absolute', inset: 0, transformOrigin }}>
        <BackgroundScene />

        {/* Couple */}
        <motion.div animate={coupleControls} initial={{ scale: 1 }}
          style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', width: '52%', maxWidth: 300, zIndex: 10, transformOrigin: 'bottom center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coupleImg} alt="Pengantin"
            style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(196,120,138,0.25))', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </motion.div>

        {/* Mid aisle flowers */}
        <motion.div animate={aisleLeftControls} initial={{ x: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          {AISLE_LEFT.map(f => (
            <div key={f.id} style={{ position: 'absolute', left: f.x + '%', bottom: f.bot + '%', transform: 'translateX(-50%)' }}>
              <FlowerStemSVG scale={f.sc} color={f.c} swayDelay={f.sd} />
            </div>
          ))}
        </motion.div>
        <motion.div animate={aisleRightControls} initial={{ x: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          {AISLE_RIGHT.map(f => (
            <div key={f.id} style={{ position: 'absolute', left: f.x + '%', bottom: f.bot + '%', transform: 'translateX(-50%)' }}>
              <FlowerStemSVG scale={f.sc} color={f.c} swayDelay={f.sd} />
            </div>
          ))}
        </motion.div>

        {/* Near flowers */}
        <motion.div animate={nearLeftControls} initial={{ x: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }}>
          {NEAR_LEFT.map(f => (
            <div key={f.id} style={{ position: 'absolute', left: f.x + '%', bottom: f.bot + '%', transform: 'translateX(-50%)' }}>
              <FlowerStemSVG scale={f.sc} color={f.c} swayDelay={f.sd} />
            </div>
          ))}
        </motion.div>
        <motion.div animate={nearRightControls} initial={{ x: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }}>
          {NEAR_RIGHT.map(f => (
            <div key={f.id} style={{ position: 'absolute', left: f.x + '%', bottom: f.bot + '%', transform: 'translateX(-50%)' }}>
              <FlowerStemSVG scale={f.sc} color={f.c} swayDelay={f.sd} />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Gate doors */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', perspective: '1400px', zIndex: 30, pointerEvents: 'none' }}>
        <motion.div animate={gateLeftControls} initial={{ rotateY: 0 }}
          style={{ width: '50%', height: '100%', transformStyle: 'preserve-3d', transformOrigin: 'left center' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #F5E8E8 0%, #FDF0F0 50%, #F5E8E8 100%)', position: 'relative', borderRight: '1px solid rgba(196,120,138,0.25)' }}>
            <GateFlowers side="left" />
            <div style={{ position: 'absolute', inset: '8px', border: '1.5px solid rgba(184,150,90,0.35)', borderRadius: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 20, background: 'linear-gradient(to right, transparent, rgba(196,120,138,0.12))', pointerEvents: 'none' }} />
          </div>
        </motion.div>
        <motion.div animate={gateRightControls} initial={{ rotateY: 0 }}
          style={{ width: '50%', height: '100%', transformStyle: 'preserve-3d', transformOrigin: 'right center' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(225deg, #F5E8E8 0%, #FDF0F0 50%, #F5E8E8 100%)', position: 'relative', borderLeft: '1px solid rgba(196,120,138,0.25)' }}>
            <GateFlowers side="right" />
            <div style={{ position: 'absolute', inset: '8px', border: '1.5px solid rgba(184,150,90,0.35)', borderRadius: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: 'linear-gradient(to left, transparent, rgba(196,120,138,0.12))', pointerEvents: 'none' }} />
          </div>
        </motion.div>
      </div>

      {/* Falling petals */}
      <AnimatePresence>
        {showPetals && PETALS.map(p => (
          <motion.div key={p.id}
            style={{ position: 'absolute', left: p.x + '%', top: '-5%', zIndex: 40, pointerEvents: 'none' }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
            animate={{ y: '115vh', x: [0, p.drift * 0.4, p.drift, p.drift * 0.7, p.drift * 1.2], rotate: [0, 90, 200, 310, 400], opacity: [0, 0.8, 0.8, 0.6, 0] }}
            transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn', times: [0, 0.08, 0.5, 0.85, 1] }}>
            <PetalSVG size={p.size} color={p.color} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Blur overlay when gate closed */}
      {!gateOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 29, backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', pointerEvents: 'none' }} />
      )}

      {/* Center text */}
      <AnimatePresence>
        {phase === 'gate' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 35 }}>
            <p style={{ fontFamily: 'var(--font-cormorant, serif)', fontSize: 24, fontWeight: 300, letterSpacing: '0.3em', fontStyle: 'italic', color: 'rgba(196,120,138,0.7)' }}>
              Selamat Datang
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
