'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

// Types
interface AnimationLayerProps {
  isActive: boolean
  onComplete: () => void
  coupleImageUrl?: string
}

// Pre-computed rose outer petals (8 petals, r=14)
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

// Inner petals (5 petals, r=7)
const ROSE_INNER_PETALS: { cx: number; cy: number; a: number }[] = [
  { cx: 7,      cy: 0,      a: 0   },
  { cx: 2.163,  cy: 6.657,  a: 72  },
  { cx: -5.663, cy: 4.114,  a: 144 },
  { cx: -5.663, cy: -4.114, a: 216 },
  { cx: 2.163,  cy: -6.657, a: 288 },
]

// 25 fairy lights (pre-computed)
const FAIRY_LIGHTS: { cx: number; cy: number; r: number; op: number }[] = [
  { cx: 4,  cy: 10, r: 2.5, op: 0.75 },
  { cx: 10, cy: 6,  r: 2.0, op: 0.55 },
  { cx: 16, cy: 14, r: 3.0, op: 0.80 },
  { cx: 22, cy: 8,  r: 2.0, op: 0.60 },
  { cx: 28, cy: 12, r: 2.5, op: 0.70 },
  { cx: 34, cy: 5,  r: 2.0, op: 0.50 },
  { cx: 40, cy: 13, r: 3.0, op: 0.80 },
  { cx: 46, cy: 7,  r: 2.0, op: 0.60 },
  { cx: 52, cy: 11, r: 2.5, op: 0.70 },
  { cx: 58, cy: 4,  r: 2.0, op: 0.50 },
  { cx: 64, cy: 14, r: 3.0, op: 0.80 },
  { cx: 70, cy: 8,  r: 2.0, op: 0.60 },
  { cx: 76, cy: 12, r: 2.5, op: 0.70 },
  { cx: 82, cy: 6,  r: 2.0, op: 0.55 },
  { cx: 88, cy: 13, r: 3.0, op: 0.80 },
  { cx: 94, cy: 9,  r: 2.0, op: 0.60 },
  { cx: 98, cy: 15, r: 2.5, op: 0.70 },
  { cx: 7,  cy: 20, r: 1.5, op: 0.40 },
  { cx: 19, cy: 22, r: 2.0, op: 0.55 },
  { cx: 31, cy: 18, r: 1.5, op: 0.40 },
  { cx: 43, cy: 21, r: 2.0, op: 0.55 },
  { cx: 55, cy: 17, r: 1.5, op: 0.40 },
  { cx: 67, cy: 23, r: 2.0, op: 0.55 },
  { cx: 79, cy: 19, r: 1.5, op: 0.40 },
  { cx: 91, cy: 22, r: 2.0, op: 0.55 },
]

// Bokeh circles
const BOKEH: { id: string; x: number; y: number; r: number; op: number; c: string }[] = [
  { id: 'bk0',  x: 8,  y: 15, r: 40, op: 0.04, c: '#C4788A' },
  { id: 'bk1',  x: 22, y: 60, r: 55, op: 0.03, c: '#B8965A' },
  { id: 'bk2',  x: 40, y: 30, r: 35, op: 0.05, c: '#C4788A' },
  { id: 'bk3',  x: 60, y: 70, r: 50, op: 0.03, c: '#D9A0AE' },
  { id: 'bk4',  x: 78, y: 20, r: 45, op: 0.04, c: '#B8965A' },
  { id: 'bk5',  x: 90, y: 55, r: 38, op: 0.05, c: '#C4788A' },
  { id: 'bk6',  x: 15, y: 80, r: 42, op: 0.03, c: '#D9A0AE' },
  { id: 'bk7',  x: 50, y: 50, r: 60, op: 0.02, c: '#C4788A' },
  { id: 'bk8',  x: 70, y: 85, r: 36, op: 0.04, c: '#B8965A' },
  { id: 'bk9',  x: 35, y: 90, r: 48, op: 0.03, c: '#D9A0AE' },
]

// 35 falling petals (pre-computed, mixed shapes)
const PETALS: {
  id: string; x: number; delay: number; dur: number
  size: number; color: string; drift: number; shape: 'round' | 'elongated' | 'leaf'
}[] = [
  { id: 'pt0',  x: 5,  delay: 0.0,  dur: 4.2, size: 8,  color: '#F2DDE2', drift: 18,  shape: 'elongated' },
  { id: 'pt1',  x: 10, delay: 0.3,  dur: 3.8, size: 6,  color: '#D9A0AE', drift: -22, shape: 'round'     },
  { id: 'pt2',  x: 17, delay: 0.6,  dur: 4.5, size: 10, color: '#E8B4C0', drift: 15,  shape: 'elongated' },
  { id: 'pt3',  x: 23, delay: 0.1,  dur: 3.6, size: 7,  color: '#F2DDE2', drift: -18, shape: 'round'     },
  { id: 'pt4',  x: 30, delay: 0.8,  dur: 4.0, size: 9,  color: '#D4B47A', drift: 20,  shape: 'leaf'      },
  { id: 'pt5',  x: 37, delay: 0.4,  dur: 3.9, size: 6,  color: '#D9A0AE', drift: -14, shape: 'elongated' },
  { id: 'pt6',  x: 44, delay: 1.0,  dur: 4.3, size: 8,  color: '#E8B4C0', drift: 16,  shape: 'round'     },
  { id: 'pt7',  x: 51, delay: 0.2,  dur: 3.7, size: 10, color: '#F2DDE2', drift: -20, shape: 'elongated' },
  { id: 'pt8',  x: 58, delay: 0.7,  dur: 4.1, size: 7,  color: '#D4B47A', drift: 12,  shape: 'leaf'      },
  { id: 'pt9',  x: 65, delay: 0.5,  dur: 3.8, size: 9,  color: '#D9A0AE', drift: -16, shape: 'round'     },
  { id: 'pt10', x: 72, delay: 1.2,  dur: 4.4, size: 6,  color: '#E8B4C0', drift: 22,  shape: 'elongated' },
  { id: 'pt11', x: 79, delay: 0.9,  dur: 3.6, size: 8,  color: '#F2DDE2', drift: -12, shape: 'round'     },
  { id: 'pt12', x: 85, delay: 0.3,  dur: 4.0, size: 10, color: '#D4B47A', drift: 18,  shape: 'leaf'      },
  { id: 'pt13', x: 91, delay: 1.1,  dur: 3.9, size: 7,  color: '#D9A0AE', drift: -24, shape: 'elongated' },
  { id: 'pt14', x: 14, delay: 1.4,  dur: 4.2, size: 9,  color: '#E8B4C0', drift: 14,  shape: 'round'     },
  { id: 'pt15', x: 27, delay: 1.6,  dur: 3.7, size: 6,  color: '#F2DDE2', drift: -18, shape: 'elongated' },
  { id: 'pt16', x: 42, delay: 1.8,  dur: 4.5, size: 8,  color: '#D4B47A', drift: 20,  shape: 'leaf'      },
  { id: 'pt17', x: 56, delay: 1.3,  dur: 3.8, size: 10, color: '#D9A0AE', drift: -15, shape: 'round'     },
  { id: 'pt18', x: 68, delay: 1.5,  dur: 4.1, size: 7,  color: '#E8B4C0', drift: 16,  shape: 'elongated' },
  { id: 'pt19', x: 82, delay: 1.7,  dur: 3.6, size: 9,  color: '#F2DDE2', drift: -20, shape: 'round'     },
  { id: 'pt20', x: 3,  delay: 2.0,  dur: 4.3, size: 7,  color: '#C4788A', drift: 14,  shape: 'elongated' },
  { id: 'pt21', x: 20, delay: 2.2,  dur: 3.9, size: 8,  color: '#E8D4A0', drift: -16, shape: 'leaf'      },
  { id: 'pt22', x: 35, delay: 2.4,  dur: 4.0, size: 6,  color: '#D9A0AE', drift: 18,  shape: 'round'     },
  { id: 'pt23', x: 48, delay: 2.1,  dur: 4.6, size: 9,  color: '#F2DDE2', drift: -22, shape: 'elongated' },
  { id: 'pt24', x: 62, delay: 2.3,  dur: 3.7, size: 7,  color: '#E8B4C0', drift: 12,  shape: 'round'     },
  { id: 'pt25', x: 75, delay: 2.5,  dur: 4.2, size: 10, color: '#D4B47A', drift: -18, shape: 'leaf'      },
  { id: 'pt26', x: 88, delay: 2.0,  dur: 3.8, size: 6,  color: '#C4788A', drift: 20,  shape: 'elongated' },
  { id: 'pt27', x: 96, delay: 2.6,  dur: 4.4, size: 8,  color: '#D9A0AE', drift: -14, shape: 'round'     },
  { id: 'pt28', x: 8,  delay: 2.8,  dur: 3.6, size: 9,  color: '#F2DDE2', drift: 16,  shape: 'elongated' },
  { id: 'pt29', x: 25, delay: 3.0,  dur: 4.1, size: 7,  color: '#E8B4C0', drift: -20, shape: 'leaf'      },
  { id: 'pt30', x: 39, delay: 2.7,  dur: 3.9, size: 8,  color: '#D4B47A', drift: 22,  shape: 'round'     },
  { id: 'pt31', x: 53, delay: 3.2,  dur: 4.3, size: 6,  color: '#C4788A', drift: -12, shape: 'elongated' },
  { id: 'pt32', x: 66, delay: 2.9,  dur: 3.7, size: 10, color: '#D9A0AE', drift: 18,  shape: 'round'     },
  { id: 'pt33', x: 77, delay: 3.1,  dur: 4.0, size: 7,  color: '#F2DDE2', drift: -16, shape: 'leaf'      },
  { id: 'pt34', x: 93, delay: 3.3,  dur: 4.5, size: 9,  color: '#E8B4C0', drift: 14,  shape: 'elongated' },
]

// Aisle flowers 12 stems per side (small=0.6, medium=1.0, large=1.4)
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

// Near (foreground) flowers 6 stems per side, scale 1.8-2.2
const NEAR_LEFT: { id: string; x: number; bot: number; sc: number; c: string; sd: number }[] = [
  { id: 'nl0', x: 0,  bot: 0,  sc: 2.0, c: '#C4788A', sd: 0.0 },
  { id: 'nl1', x: 5,  bot: 2,  sc: 1.8, c: '#D9A0AE', sd: 0.4 },
  { id: 'nl2', x: 10, bot: 0,  sc: 2.2, c: '#E8B4C0', sd: 0.8 },
  { id: 'nl3', x: 2,  bot: 5,  sc: 1.9, c: '#C4788A', sd: 0.2 },
  { id: 'nl4', x: 7,  bot: 3,  sc: 2.1, c: '#D9A0AE', sd: 0.6 },
  { id: 'nl5', x: 12, bot: 1,  sc: 1.8, c: '#E8B4C0', sd: 1.0 },
]
const NEAR_RIGHT: { id: string; x: number; bot: number; sc: number; c: string; sd: number }[] = [
  { id: 'nr0', x: 100, bot: 0, sc: 2.0, c: '#D9A0AE', sd: 0.2 },
  { id: 'nr1', x: 95,  bot: 2, sc: 1.8, c: '#C4788A', sd: 0.6 },
  { id: 'nr2', x: 90,  bot: 0, sc: 2.2, c: '#E8B4C0', sd: 1.0 },
  { id: 'nr3', x: 98,  bot: 5, sc: 1.9, c: '#D9A0AE', sd: 0.3 },
  { id: 'nr4', x: 93,  bot: 3, sc: 2.1, c: '#C4788A', sd: 0.7 },
  { id: 'nr5', x: 88,  bot: 1, sc: 1.8, c: '#E8B4C0', sd: 0.1 },
]

// Sparkle/star positions
const SPARKLES: { id: string; x: number; y: number; s: number; op: number }[] = [
  { id: 'sp0',  x: 12, y: 8,  s: 6,  op: 0.45 },
  { id: 'sp1',  x: 25, y: 15, s: 4,  op: 0.35 },
  { id: 'sp2',  x: 38, y: 6,  s: 7,  op: 0.50 },
  { id: 'sp3',  x: 52, y: 12, s: 5,  op: 0.40 },
  { id: 'sp4',  x: 65, y: 7,  s: 6,  op: 0.45 },
  { id: 'sp5',  x: 78, y: 14, s: 4,  op: 0.35 },
  { id: 'sp6',  x: 88, y: 9,  s: 7,  op: 0.50 },
  { id: 'sp7',  x: 6,  y: 25, s: 5,  op: 0.40 },
  { id: 'sp8',  x: 45, y: 22, s: 4,  op: 0.35 },
  { id: 'sp9',  x: 72, y: 20, s: 6,  op: 0.45 },
  { id: 'sp10', x: 93, y: 18, s: 5,  op: 0.40 },
  { id: 'sp11', x: 18, y: 30, s: 4,  op: 0.30 },
]

// Butterfly positions
const BUTTERFLIES: { id: string; x: number; y: number; sc: number; delay: number }[] = [
  { id: 'bf0', x: 20, y: 30, sc: 1.0, delay: 0.5 },
  { id: 'bf1', x: 75, y: 25, sc: 0.8, delay: 1.2 },
  { id: 'bf2', x: 55, y: 40, sc: 0.9, delay: 0.8 },
]

// Ground petal scatter
const GROUND_PETALS: { id: string; x: number; s: number; c: string; rot: number }[] = [
  { id: 'gp0',  x: 15, s: 5,  c: '#F2DDE2', rot: 15  },
  { id: 'gp1',  x: 22, s: 4,  c: '#D9A0AE', rot: -20 },
  { id: 'gp2',  x: 30, s: 6,  c: '#E8B4C0', rot: 35  },
  { id: 'gp3',  x: 38, s: 4,  c: '#F2DDE2', rot: -10 },
  { id: 'gp4',  x: 45, s: 5,  c: '#D9A0AE', rot: 25  },
  { id: 'gp5',  x: 53, s: 4,  c: '#E8B4C0', rot: -30 },
  { id: 'gp6',  x: 60, s: 6,  c: '#F2DDE2', rot: 18  },
  { id: 'gp7',  x: 68, s: 5,  c: '#D9A0AE', rot: -22 },
  { id: 'gp8',  x: 75, s: 4,  c: '#E8B4C0', rot: 40  },
  { id: 'gp9',  x: 82, s: 6,  c: '#F2DDE2', rot: -15 },
]


// SVG Sub-components

function RoseSVG({ scale = 1, color = '#C4788A' }: { scale?: number; color?: string }) {
  const dim = Math.round(44 * scale)
  const lightColor = color === '#B8965A' || color === '#D4B47A' ? '#F5ECD8' : '#FDF8F5'
  return (
    <svg width={dim} height={dim} viewBox='-22 -22 44 44' fill='none'>
      {ROSE_OUTER_PETALS.map(({ cx, cy, a }) => (
        <ellipse
          key={'o' + a}
          cx={cx} cy={cy} rx='9' ry='13'
          transform={'rotate(' + a + ',' + cx + ',' + cy + ')'}
          fill={color} fillOpacity='0.72'
        />
      ))}
      {ROSE_INNER_PETALS.map(({ cx, cy, a }) => (
        <ellipse
          key={'i' + a}
          cx={cx} cy={cy} rx='5.5' ry='8.5'
          transform={'rotate(' + a + ',' + cx + ',' + cy + ')'}
          fill={color} fillOpacity='0.88'
        />
      ))}
      <circle r='4.5' fill={lightColor} />
      <circle r='2' fill={color} fillOpacity='0.55' />
    </svg>
  )
}

function LeafSVG({ scale = 1 }: { scale?: number }) {
  const w = Math.round(28 * scale)
  const h = Math.round(16 * scale)
  return (
    <svg width={w} height={h} viewBox='0 0 28 16' fill='none'>
      <ellipse cx='14' cy='8' rx='13' ry='7' fill='#8A9E6A' fillOpacity='0.55' />
      <line x1='2' y1='8' x2='26' y2='8' stroke='#6A7A4A' strokeWidth='1' strokeOpacity='0.4' />
    </svg>
  )
}

function LargeLeafClusterSVG({ scale = 1 }: { scale?: number }) {
  const w = Math.round(60 * scale)
  const h = Math.round(40 * scale)
  return (
    <svg width={w} height={h} viewBox='0 0 60 40' fill='none'>
      <ellipse cx='30' cy='20' rx='28' ry='14' fill='#8A9E6A' fillOpacity='0.50' />
      <ellipse cx='15' cy='28' rx='18' ry='10' transform='rotate(-20,15,28)' fill='#6A7A4A' fillOpacity='0.45' />
      <ellipse cx='45' cy='28' rx='18' ry='10' transform='rotate(20,45,28)' fill='#A8C080' fillOpacity='0.40' />
      <line x1='5' y1='20' x2='55' y2='20' stroke='#6A7A4A' strokeWidth='1.2' strokeOpacity='0.35' />
      <line x1='15' y1='28' x2='30' y2='20' stroke='#6A7A4A' strokeWidth='0.8' strokeOpacity='0.30' />
      <line x1='45' y1='28' x2='30' y2='20' stroke='#6A7A4A' strokeWidth='0.8' strokeOpacity='0.30' />
    </svg>
  )
}

function PetalSVG({ size, color, shape }: { size: number; color: string; shape: 'round' | 'elongated' | 'leaf' }) {
  if (shape === 'round') {
    return (
      <svg width={size} height={size} viewBox='-8 -8 16 16' fill='none'>
        <ellipse cx='0' cy='0' rx='7' ry='7' fill={color} fillOpacity='0.72' />
      </svg>
    )
  }
  if (shape === 'leaf') {
    return (
      <svg width={size} height={Math.round(size * 1.8)} viewBox='-6 -10 12 20' fill='none'>
        <path d='M0,-9 C5,-4 5,4 0,9 C-5,4 -5,-4 0,-9' fill={color} fillOpacity='0.65' />
        <line x1='0' y1='-8' x2='0' y2='8' stroke='#6A7A4A' strokeWidth='0.8' strokeOpacity='0.4' />
      </svg>
    )
  }
  // elongated
  return (
    <svg width={size} height={Math.round(size * 1.6)} viewBox='-8 -12 16 24' fill='none'>
      <path d='M0,-11 C4,-7 4,7 0,11 C-4,7 -4,-7 0,-11' fill={color} fillOpacity='0.72' />
    </svg>
  )
}

function SparkleSVG({ size, opacity }: { size: number; opacity: number }) {
  const h = size
  return (
    <svg width={h} height={h} viewBox='-10 -10 20 20' fill='none' style={{ opacity }}>
      <line x1='0' y1='-9' x2='0' y2='9' stroke='#D4B47A' strokeWidth='1.5' strokeLinecap='round' />
      <line x1='-9' y1='0' x2='9' y2='0' stroke='#D4B47A' strokeWidth='1.5' strokeLinecap='round' />
      <line x1='-6.4' y1='-6.4' x2='6.4' y2='6.4' stroke='#E8D4A0' strokeWidth='0.8' strokeLinecap='round' />
      <line x1='6.4' y1='-6.4' x2='-6.4' y2='6.4' stroke='#E8D4A0' strokeWidth='0.8' strokeLinecap='round' />
      <circle r='2' fill='#D4B47A' fillOpacity='0.8' />
    </svg>
  )
}

function ButterflySVG({ scale = 1 }: { scale?: number }) {
  const w = Math.round(40 * scale)
  const h = Math.round(30 * scale)
  return (
    <svg width={w} height={h} viewBox='0 0 40 30' fill='none'>
      {/* Left wings */}
      <ellipse cx='12' cy='10' rx='11' ry='8' transform='rotate(-20,12,10)' fill='#E8B4C0' fillOpacity='0.65' />
      <ellipse cx='10' cy='20' rx='8' ry='6' transform='rotate(15,10,20)' fill='#D9A0AE' fillOpacity='0.55' />
      {/* Right wings */}
      <ellipse cx='28' cy='10' rx='11' ry='8' transform='rotate(20,28,10)' fill='#E8B4C0' fillOpacity='0.65' />
      <ellipse cx='30' cy='20' rx='8' ry='6' transform='rotate(-15,30,20)' fill='#D9A0AE' fillOpacity='0.55' />
      {/* Body */}
      <ellipse cx='20' cy='15' rx='2' ry='8' fill='#B8965A' fillOpacity='0.7' />
      {/* Antennae */}
      <line x1='20' y1='7' x2='14' y2='2' stroke='#B8965A' strokeWidth='0.8' strokeOpacity='0.6' />
      <line x1='20' y1='7' x2='26' y2='2' stroke='#B8965A' strokeWidth='0.8' strokeOpacity='0.6' />
      <circle cx='14' cy='2' r='1' fill='#B8965A' fillOpacity='0.6' />
      <circle cx='26' cy='2' r='1' fill='#B8965A' fillOpacity='0.6' />
    </svg>
  )
}

// Tall flower stem with rose on top, two leaves, and optional large leaf cluster
function FlowerStemSVG({ scale = 1, color = '#C4788A', swayDelay = 0, withLeafCluster = false }: {
  scale?: number; color?: string; swayDelay?: number; withLeafCluster?: boolean
}) {
  const h = Math.round(120 * scale)
  const w = Math.round(50 * scale)
  return (
    <motion.div
      style={{ width: w, height: h, position: 'relative', transformOrigin: 'bottom center' }}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: swayDelay }}
    >
      <svg width={w} height={h} viewBox='0 0 50 120' fill='none'>
        {/* Stem */}
        <line x1='25' y1='115' x2='25' y2='30' stroke='#8A9E6A' strokeWidth='2.5' strokeLinecap='round' />
        {/* Left leaf */}
        <ellipse cx='14' cy='78' rx='12' ry='6' transform='rotate(-30,14,78)' fill='#8A9E6A' fillOpacity='0.6' />
        <line x1='14' y1='78' x2='25' y2='72' stroke='#6A7A4A' strokeWidth='0.8' strokeOpacity='0.4' />
        {/* Right leaf */}
        <ellipse cx='36' cy='62' rx='12' ry='6' transform='rotate(30,36,62)' fill='#6A7A4A' fillOpacity='0.55' />
        <line x1='36' y1='62' x2='25' y2='58' stroke='#6A7A4A' strokeWidth='0.8' strokeOpacity='0.4' />
        {/* Extra small leaf */}
        <ellipse cx='18' cy='50' rx='8' ry='4' transform='rotate(-20,18,50)' fill='#A8C080' fillOpacity='0.45' />
      </svg>
      {/* Rose on top */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
        <RoseSVG scale={scale * 0.75} color={color} />
      </div>
      {/* Optional large leaf cluster at base */}
      {withLeafCluster && (
        <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)' }}>
          <LargeLeafClusterSVG scale={scale * 0.6} />
        </div>
      )}
    </motion.div>
  )
}

// Small flower bush cluster (3-5 roses close together)
function FlowerBushSVG({ colors }: { colors: string[] }) {
  const offsets = [
    { x: 0,   y: 0,  s: 0.7 },
    { x: -18, y: 8,  s: 0.6 },
    { x: 18,  y: 8,  s: 0.6 },
    { x: -10, y: 16, s: 0.5 },
    { x: 10,  y: 16, s: 0.5 },
  ]
  return (
    <div style={{ position: 'relative', width: 60, height: 50 }}>
      {offsets.slice(0, colors.length).map((o, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: 30 + o.x,
          top: o.y,
          transform: 'translateX(-50%)',
        }}>
          <RoseSVG scale={o.s} color={colors[i]} />
        </div>
      ))}
    </div>
  )
}

// Hanging garland path with small roses along it
function HangingGarlandSVG({ width = 200, color = '#C4788A' }: { width?: number; color?: string }) {
  // Pre-computed rose positions along a catenary-like curve
  // y = 30 * (cosh((x-0.5)/0.4) - cosh(-0.5/0.4)) normalized
  // Simplified: 5 points along a parabola y = 40*(x/w - 0.5)^2 * 4
  // Pre-computed garland curve as cubic bezier
  const pathD = 'M0,0 C' + (width * 0.25) + ',30 ' + (width * 0.75) + ',30 ' + width + ',0'
  // Leaf positions along the garland (pre-computed at 20%, 40%, 50%, 60%, 80%)
  const leafPts = [
    { x: width * 0.2, y: 18 },
    { x: width * 0.4, y: 27 },
    { x: width * 0.5, y: 30 },
    { x: width * 0.6, y: 27 },
    { x: width * 0.8, y: 18 },
  ]
  // Rose positions at 25%, 50%, 75%
  const rosePts = [
    { x: width * 0.25, y: 22 },
    { x: width * 0.5,  y: 30 },
    { x: width * 0.75, y: 22 },
  ]
  return (
    <svg width={width} height={40} viewBox={'0 0 ' + width + ' 40'} fill='none'>
      {/* Garland rope */}
      <path d={pathD} stroke='#8A9E6A' strokeWidth='1.5' strokeOpacity='0.5' fill='none' />
      {/* Leaves along garland */}
      {leafPts.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y + 4} rx='6' ry='3' fill='#8A9E6A' fillOpacity='0.45' />
      ))}
      {/* Roses at key points */}
      {rosePts.map((p, i) => (
        <g key={i} transform={'translate(' + (p.x - 8) + ',' + (p.y - 6) + ')'}>
          <circle cx='8' cy='8' r='7' fill={color} fillOpacity='0.55' />
          <circle cx='8' cy='8' r='3.5' fill='#FDF8F5' fillOpacity='0.6' />
        </g>
      ))}
    </svg>
  )
}


// Wedding arch SVG - detailed with 15+ flower clusters, garlands, ribbon drape
function WeddingArchSVG() {
  return (
    <svg width='300' height='320' viewBox='0 0 300 320' fill='none'>
      {/* Arch posts - thicker */}
      <rect x='18' y='85' width='18' height='235' rx='9' fill='#D4B47A' fillOpacity='0.55' />
      <rect x='264' y='85' width='18' height='235' rx='9' fill='#D4B47A' fillOpacity='0.55' />
      {/* Post inner highlight */}
      <rect x='22' y='90' width='6' height='225' rx='3' fill='#E8D4A0' fillOpacity='0.35' />
      <rect x='268' y='90' width='6' height='225' rx='3' fill='#E8D4A0' fillOpacity='0.35' />
      {/* Arch curve - outer */}
      <path d='M36,85 Q150,-30 264,85' stroke='#D4B47A' strokeWidth='14' strokeLinecap='round' fill='none' strokeOpacity='0.60' />
      {/* Arch curve - inner highlight */}
      <path d='M42,88 Q150,-18 258,88' stroke='#E8D4A0' strokeWidth='5' strokeLinecap='round' fill='none' strokeOpacity='0.45' />
      {/* Ribbon/drape effect */}
      <path d='M36,85 Q90,60 150,55 Q210,60 264,85' stroke='#F2DDE2' strokeWidth='3' strokeLinecap='round' fill='none' strokeOpacity='0.50' strokeDasharray='8,4' />

      {/* Flower clusters on arch - 15 flowers */}
      {/* Top center */}
      <circle cx='150' cy='14' r='12' fill='#C4788A' fillOpacity='0.50' />
      <circle cx='150' cy='14' r='6'  fill='#F2DDE2' fillOpacity='0.65' />
      <circle cx='138' cy='20' r='8'  fill='#D9A0AE' fillOpacity='0.45' />
      <circle cx='162' cy='20' r='8'  fill='#D9A0AE' fillOpacity='0.45' />
      {/* Left side of arch */}
      <circle cx='90'  cy='32' r='10' fill='#C4788A' fillOpacity='0.48' />
      <circle cx='90'  cy='32' r='5'  fill='#F2DDE2' fillOpacity='0.60' />
      <circle cx='78'  cy='40' r='7'  fill='#E8B4C0' fillOpacity='0.45' />
      <circle cx='66'  cy='55' r='9'  fill='#D9A0AE' fillOpacity='0.48' />
      <circle cx='66'  cy='55' r='4.5' fill='#F2DDE2' fillOpacity='0.60' />
      <circle cx='52'  cy='72' r='8'  fill='#C4788A' fillOpacity='0.45' />
      {/* Right side of arch */}
      <circle cx='210' cy='32' r='10' fill='#C4788A' fillOpacity='0.48' />
      <circle cx='210' cy='32' r='5'  fill='#F2DDE2' fillOpacity='0.60' />
      <circle cx='222' cy='40' r='7'  fill='#E8B4C0' fillOpacity='0.45' />
      <circle cx='234' cy='55' r='9'  fill='#D9A0AE' fillOpacity='0.48' />
      <circle cx='234' cy='55' r='4.5' fill='#F2DDE2' fillOpacity='0.60' />
      <circle cx='248' cy='72' r='8'  fill='#C4788A' fillOpacity='0.45' />
      {/* Post tops */}
      <circle cx='27'  cy='83' r='9'  fill='#C4788A' fillOpacity='0.50' />
      <circle cx='27'  cy='83' r='4.5' fill='#F2DDE2' fillOpacity='0.60' />
      <circle cx='273' cy='83' r='9'  fill='#C4788A' fillOpacity='0.50' />
      <circle cx='273' cy='83' r='4.5' fill='#F2DDE2' fillOpacity='0.60' />

      {/* Hanging garland lines from posts */}
      <path d='M27,92 Q27,130 27,160' stroke='#8A9E6A' strokeWidth='2' strokeOpacity='0.40' fill='none' />
      <path d='M273,92 Q273,130 273,160' stroke='#8A9E6A' strokeWidth='2' strokeOpacity='0.40' fill='none' />
      {/* Leaf clusters on hanging garland */}
      <ellipse cx='27' cy='110' rx='8' ry='4' fill='#8A9E6A' fillOpacity='0.40' />
      <ellipse cx='27' cy='130' rx='7' ry='3.5' fill='#A8C080' fillOpacity='0.38' />
      <ellipse cx='27' cy='150' rx='8' ry='4' fill='#8A9E6A' fillOpacity='0.40' />
      <ellipse cx='273' cy='110' rx='8' ry='4' fill='#8A9E6A' fillOpacity='0.40' />
      <ellipse cx='273' cy='130' rx='7' ry='3.5' fill='#A8C080' fillOpacity='0.38' />
      <ellipse cx='273' cy='150' rx='8' ry='4' fill='#8A9E6A' fillOpacity='0.40' />

      {/* Fairy lights on arch */}
      <circle cx='60'  cy='68' r='2.5' fill='#D4B47A' fillOpacity='0.70' />
      <circle cx='90'  cy='38' r='2.0' fill='#E8D4A0' fillOpacity='0.65' />
      <circle cx='120' cy='20' r='2.5' fill='#D4B47A' fillOpacity='0.70' />
      <circle cx='150' cy='14' r='2.0' fill='#E8D4A0' fillOpacity='0.65' />
      <circle cx='180' cy='20' r='2.5' fill='#D4B47A' fillOpacity='0.70' />
      <circle cx='210' cy='38' r='2.0' fill='#E8D4A0' fillOpacity='0.65' />
      <circle cx='240' cy='68' r='2.5' fill='#D4B47A' fillOpacity='0.70' />
    </svg>
  )
}

// Side floral bush for far background
function SideBushSVG({ side }: { side: 'left' | 'right' }) {
  return (
    <svg width='200' height='180' viewBox='0 0 200 180' fill='none' style={{ transform: side === 'right' ? 'scaleX(-1)' : 'none' }}>
      {/* Large bush body */}
      <ellipse cx='80' cy='120' rx='75' ry='55' fill='#8A9E6A' fillOpacity='0.35' />
      <ellipse cx='60' cy='100' rx='55' ry='45' fill='#A8C080' fillOpacity='0.30' />
      <ellipse cx='100' cy='110' rx='60' ry='40' fill='#6A7A4A' fillOpacity='0.28' />
      {/* Flower clusters on bush */}
      <circle cx='40'  cy='80'  r='14' fill='#C4788A' fillOpacity='0.40' />
      <circle cx='40'  cy='80'  r='7'  fill='#F2DDE2' fillOpacity='0.55' />
      <circle cx='75'  cy='65'  r='12' fill='#D9A0AE' fillOpacity='0.42' />
      <circle cx='75'  cy='65'  r='6'  fill='#F2DDE2' fillOpacity='0.55' />
      <circle cx='110' cy='75'  r='14' fill='#C4788A' fillOpacity='0.40' />
      <circle cx='110' cy='75'  r='7'  fill='#F2DDE2' fillOpacity='0.55' />
      <circle cx='55'  cy='105' r='10' fill='#E8B4C0' fillOpacity='0.42' />
      <circle cx='90'  cy='95'  r='12' fill='#D9A0AE' fillOpacity='0.40' />
      <circle cx='125' cy='100' r='10' fill='#C4788A' fillOpacity='0.38' />
      {/* Tall stems */}
      <line x1='40'  y1='80'  x2='40'  y2='140' stroke='#8A9E6A' strokeWidth='2' strokeOpacity='0.35' />
      <line x1='75'  y1='65'  x2='75'  y2='140' stroke='#8A9E6A' strokeWidth='2' strokeOpacity='0.35' />
      <line x1='110' y1='75'  x2='110' y2='140' stroke='#8A9E6A' strokeWidth='2' strokeOpacity='0.35' />
    </svg>
  )
}

// Gate door panel (left or right)
function GateDoor({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left'
  // 8 roses per door arranged in 2 columns
  const roseLayout = [
    { c: '#C4788A', s: 0.85 },
    { c: '#D9A0AE', s: 0.75 },
    { c: '#E8B4C0', s: 0.80 },
    { c: '#C4788A', s: 0.75 },
    { c: '#D9A0AE', s: 0.85 },
    { c: '#C4788A', s: 0.75 },
    { c: '#E8B4C0', s: 0.80 },
    { c: '#D9A0AE', s: 0.85 },
  ]
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 40%, #F5E8E8 70%, #FDF0F0 100%)',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: [
          'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 40%, #F5E8E8 70%, #FDF0F0 100%)',
          'repeating-linear-gradient(' + (isLeft ? '92deg' : '88deg') + ', transparent 0px, transparent 18px, rgba(196,120,138,0.04) 18px, rgba(196,120,138,0.04) 19px)',
        ].join(', '),
      }}
    >
      {/* Gold border lines */}
      <div style={{ position: 'absolute', inset: '8px', border: '1.5px solid rgba(184,150,90,0.35)', borderRadius: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: '14px', border: '1px solid rgba(212,180,122,0.25)', borderRadius: 1, pointerEvents: 'none' }} />

      {/* Flower garland along top edge */}
      <div style={{ position: 'absolute', top: 18, left: 18, right: 18, pointerEvents: 'none' }}>
        <HangingGarlandSVG width={120} color='#C4788A' />
      </div>

      {/* Ribbon bow at top center */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
        <svg width='40' height='28' viewBox='0 0 40 28' fill='none'>
          {/* Left bow loop */}
          <ellipse cx='12' cy='14' rx='11' ry='7' transform='rotate(-20,12,14)' fill='#C4788A' fillOpacity='0.55' />
          {/* Right bow loop */}
          <ellipse cx='28' cy='14' rx='11' ry='7' transform='rotate(20,28,14)' fill='#C4788A' fillOpacity='0.55' />
          {/* Center knot */}
          <ellipse cx='20' cy='14' rx='5' ry='4' fill='#D9A0AE' fillOpacity='0.70' />
          {/* Ribbon tails */}
          <path d='M15,18 Q10,26 6,28' stroke='#C4788A' strokeWidth='2' strokeOpacity='0.50' fill='none' />
          <path d='M25,18 Q30,26 34,28' stroke='#C4788A' strokeWidth='2' strokeOpacity='0.50' fill='none' />
        </svg>
      </div>

      {/* Gold ornamental lines between roses */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox='0 0 100 100' preserveAspectRatio='none'>
        <path d='M20,25 Q50,28 80,25' stroke='#D4B47A' strokeWidth='0.5' strokeOpacity='0.35' fill='none' />
        <path d='M20,45 Q50,48 80,45' stroke='#D4B47A' strokeWidth='0.5' strokeOpacity='0.35' fill='none' />
        <path d='M20,65 Q50,68 80,65' stroke='#D4B47A' strokeWidth='0.5' strokeOpacity='0.35' fill='none' />
        <path d='M20,85 Q50,88 80,85' stroke='#D4B47A' strokeWidth='0.5' strokeOpacity='0.35' fill='none' />
        <line x1='50' y1='20' x2='50' y2='95' stroke='#D4B47A' strokeWidth='0.4' strokeOpacity='0.25' />
      </svg>

      {/* 8 roses arranged in 2 columns x 4 rows */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'repeat(4, 1fr)',
        padding: '48px 16px 20px',
        gap: 4,
      }}>
        {roseLayout.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.55 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <LeafSVG scale={0.45} />
              <RoseSVG scale={r.s} color={r.c} />
              <LeafSVG scale={0.45} />
            </div>
          </div>
        ))}
      </div>

      {/* Inner shadow on meeting edge */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        [isLeft ? 'right' : 'left']: 0,
        width: 20,
        background: 'linear-gradient(to ' + (isLeft ? 'right' : 'left') + ', transparent, rgba(196,120,138,0.12))',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

// Background scene
function BackgroundScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Multi-layer sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #FDF8F5 0%, #FAF0F0 30%, #F8EEF0 55%, #F5E8E8 75%, #F0E0E4 100%)',
      }} />

      {/* Soft pink clouds (SVG ellipses, blurred) */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', pointerEvents: 'none' }}
        viewBox='0 0 100 40' preserveAspectRatio='none'>
        <defs>
          <filter id='cloudBlur'>
            <feGaussianBlur stdDeviation='2.5' />
          </filter>
        </defs>
        <ellipse cx='15' cy='12' rx='18' ry='8' fill='#F2DDE2' fillOpacity='0.35' filter='url(#cloudBlur)' />
        <ellipse cx='35' cy='8'  rx='22' ry='9' fill='#FAF0F0' fillOpacity='0.40' filter='url(#cloudBlur)' />
        <ellipse cx='60' cy='10' rx='20' ry='8' fill='#F2DDE2' fillOpacity='0.35' filter='url(#cloudBlur)' />
        <ellipse cx='80' cy='7'  rx='18' ry='7' fill='#FAF0F0' fillOpacity='0.38' filter='url(#cloudBlur)' />
        <ellipse cx='92' cy='14' rx='14' ry='6' fill='#F2DDE2' fillOpacity='0.32' filter='url(#cloudBlur)' />
      </svg>

      {/* Bokeh depth circles */}
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

      {/* Sparkle stars in background */}
      {SPARKLES.map(sp => (
        <div key={sp.id} style={{
          position: 'absolute',
          left: sp.x + '%', top: sp.y + '%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }}>
          <SparkleSVG size={sp.s} opacity={sp.op} />
        </div>
      ))}

      {/* 25 fairy lights with glow */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '30%', pointerEvents: 'none' }}
        viewBox='0 0 100 30' preserveAspectRatio='none'>
        <defs>
          <radialGradient id='lightGlow' cx='50%' cy='50%' r='50%'>
            <stop offset='0%' stopColor='#E8D4A0' stopOpacity='0.8' />
            <stop offset='100%' stopColor='#D4B47A' stopOpacity='0' />
          </radialGradient>
        </defs>
        {FAIRY_LIGHTS.map((fl, i) => (
          <g key={i}>
            <circle cx={fl.cx} cy={fl.cy} r={fl.r * 1.8} fill='url(#lightGlow)' />
            <circle cx={fl.cx} cy={fl.cy} r={fl.r * 0.4} fill='#D4B47A' fillOpacity={fl.op} />
          </g>
        ))}
      </svg>

      {/* Side floral bushes far left and right */}
      <div style={{ position: 'absolute', left: -20, bottom: '15%', opacity: 0.70, pointerEvents: 'none' }}>
        <SideBushSVG side='left' />
      </div>
      <div style={{ position: 'absolute', right: -20, bottom: '15%', opacity: 0.70, pointerEvents: 'none' }}>
        <SideBushSVG side='right' />
      </div>

      {/* Ground soft gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: 'linear-gradient(to top, rgba(138,158,106,0.14) 0%, rgba(196,120,138,0.07) 50%, transparent 100%)',
      }} />

      {/* Grass tufts at ground level */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '12%', pointerEvents: 'none' }}
        viewBox='0 0 100 12' preserveAspectRatio='none'>
        {[5,12,20,28,35,42,50,58,65,72,80,88,95].map((x, i) => (
          <g key={i}>
            <path d={'M' + x + ',12 Q' + (x-1) + ',8 ' + (x-2) + ',5'} stroke='#8A9E6A' strokeWidth='0.6' strokeOpacity='0.50' fill='none' />
            <path d={'M' + x + ',12 Q' + x + ',7 ' + x + ',4'} stroke='#A8C080' strokeWidth='0.6' strokeOpacity='0.45' fill='none' />
            <path d={'M' + x + ',12 Q' + (x+1) + ',8 ' + (x+2) + ',5'} stroke='#8A9E6A' strokeWidth='0.6' strokeOpacity='0.50' fill='none' />
          </g>
        ))}
      </svg>

      {/* Ground-level flower bushes */}
      <div style={{ position: 'absolute', bottom: '6%', left: '18%', pointerEvents: 'none' }}>
        <FlowerBushSVG colors={['#C4788A', '#D9A0AE', '#E8B4C0', '#C4788A', '#D9A0AE']} />
      </div>
      <div style={{ position: 'absolute', bottom: '6%', right: '18%', pointerEvents: 'none' }}>
        <FlowerBushSVG colors={['#D9A0AE', '#C4788A', '#E8B4C0', '#D9A0AE', '#C4788A']} />
      </div>
      <div style={{ position: 'absolute', bottom: '6%', left: '38%', pointerEvents: 'none' }}>
        <FlowerBushSVG colors={['#E8B4C0', '#C4788A', '#D9A0AE']} />
      </div>
      <div style={{ position: 'absolute', bottom: '6%', right: '38%', pointerEvents: 'none' }}>
        <FlowerBushSVG colors={['#C4788A', '#E8B4C0', '#D9A0AE']} />
      </div>

      {/* Ground rose petals scattered */}
      {GROUND_PETALS.map(gp => (
        <div key={gp.id} style={{
          position: 'absolute',
          left: gp.x + '%',
          bottom: '2%',
          transform: 'rotate(' + gp.rot + 'deg)',
          pointerEvents: 'none',
        }}>
          <svg width={gp.s * 2} height={gp.s * 2} viewBox='-5 -5 10 10' fill='none'>
            <ellipse cx='0' cy='0' rx='4' ry='4' fill={gp.c} fillOpacity='0.55' />
          </svg>
        </div>
      ))}

      {/* Butterflies */}
      {BUTTERFLIES.map(bf => (
        <motion.div
          key={bf.id}
          style={{
            position: 'absolute',
            left: bf.x + '%',
            top: bf.y + '%',
            pointerEvents: 'none',
          }}
          animate={{
            y: [0, -12, 0, -8, 0],
            x: [0, 6, 12, 6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: bf.delay,
          }}
        >
          <ButterflySVG scale={bf.sc} />
        </motion.div>
      ))}

      {/* Wedding arch centered in background */}
      <div style={{
        position: 'absolute',
        bottom: '18%', left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0.68,
      }}>
        <WeddingArchSVG />
      </div>

      {/* Hanging garland from top of scene */}
      <div style={{ position: 'absolute', top: '2%', left: '10%', right: '10%', pointerEvents: 'none', opacity: 0.55 }}>
        <HangingGarlandSVG width={300} color='#D9A0AE' />
      </div>
    </div>
  )
}


// Main AnimationLayer component
export function AnimationLayer({ isActive, onComplete, coupleImageUrl }: AnimationLayerProps) {
  const onCompleteRef = useRef(onComplete)
  const calledRef     = useRef(false)
  const [showPetals, setShowPetals] = useState(false)
  const [gateOpen, setGateOpen]     = useState(false)
  const [isMobile, setIsMobile]     = useState(false)

  // Animation controls
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

  // Detect mobile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768)
    }
  }, [])

  useEffect(() => {
    if (!isActive) return

    const safeComplete = () => {
      if (!calledRef.current) {
        calledRef.current = true
        onCompleteRef.current()
      }
    }

    // Check CSS 3D support
    const supports3D = (() => {
      if (typeof window === 'undefined') return false
      const el = document.createElement('div')
      el.style.transform = 'rotateY(1deg)'
      return el.style.transform !== ''
    })()

    if (!supports3D) {
      containerControls.start({ opacity: 0, transition: { duration: 0.4 } }).then(safeComplete)
      return
    }

    // Mobile-adjusted zoom params
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768
    const zoomScale = mobile ? 2.8 : 3.5

    const run = async () => {
      // Phase 1: Gate closed (0 - 0.5s)
      await new Promise(r => setTimeout(r, 500))

      // Phase 2: Gate opens (0.5 - 2.0s)
      setGateOpen(true)
      setShowPetals(true)

      await Promise.all([
        gateLeftControls.start({
          rotateY: -110,
          transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] },
        }),
        gateRightControls.start({
          rotateY: 110,
          transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] },
        }),
      ])

      // Phase 3: Camera zoom in with parallax (2.0 - 5.2s)
      await Promise.all([
        sceneControls.start({
          scale: zoomScale,
          transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] },
        }),
        aisleLeftControls.start({
          x: '-55%',
          transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] },
        }),
        aisleRightControls.start({
          x: '55%',
          transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] },
        }),
        nearLeftControls.start({
          x: '-90%',
          transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] },
        }),
        nearRightControls.start({
          x: '90%',
          transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] },
        }),
        coupleControls.start({
          scale: 1.08,
          transition: { duration: 3.2, ease: [0.2, 0, 0.4, 1] },
        }),
      ])

      // Phase 4: Fade out (5.2 - 6.0s)
      await containerControls.start({
        opacity: 0,
        transition: { duration: 0.8, ease: 'easeIn' },
      })

      safeComplete()
    }

    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  if (!isActive) return null

  const coupleImg = coupleImageUrl ?? '/images/couple-illustration.png'
  // Mobile-adjusted transform origin: center on couple at bottom
  const transformOrigin = isMobile ? 'center 80%' : 'center 72%'

  return (
    <motion.div
      animate={containerControls}
      initial={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #FDF8F5 0%, #FAF0F0 50%, #F5E8E8 100%)',
      }}
      aria-hidden='true'
    >
      {/* Scene container - zooms in during phase 3 */}
      <motion.div
        animate={sceneControls}
        initial={{ scale: 1 }}
        style={{
          position: 'absolute', inset: 0,
          transformOrigin,
        }}
      >
        {/* Layer 1: sky, arch, fairy lights, butterflies */}
        <BackgroundScene />

        {/* Layer 2: mid aisle flowers - sway + move outward on zoom */}
        <motion.div
          animate={aisleLeftControls}
          initial={{ x: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}
        >
          {AISLE_LEFT.map(f => (
            <div key={f.id} style={{
              position: 'absolute',
              left: f.x + '%',
              bottom: f.bot + '%',
              transform: 'translateX(-50%)',
            }}>
              <FlowerStemSVG scale={f.sc} color={f.c} swayDelay={f.sd} withLeafCluster={f.sc >= 1.2} />
            </div>
          ))}
          {/* Flower bushes at ground level on aisle left */}
          <div style={{ position: 'absolute', left: '3%', bottom: '1%', pointerEvents: 'none' }}>
            <FlowerBushSVG colors={['#C4788A', '#D9A0AE', '#E8B4C0']} />
          </div>
          <div style={{ position: 'absolute', left: '8%', bottom: '0%', pointerEvents: 'none' }}>
            <FlowerBushSVG colors={['#D9A0AE', '#C4788A', '#E8B4C0', '#D9A0AE']} />
          </div>
        </motion.div>

        <motion.div
          animate={aisleRightControls}
          initial={{ x: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}
        >
          {AISLE_RIGHT.map(f => (
            <div key={f.id} style={{
              position: 'absolute',
              left: f.x + '%',
              bottom: f.bot + '%',
              transform: 'translateX(-50%)',
            }}>
              <FlowerStemSVG scale={f.sc} color={f.c} swayDelay={f.sd} withLeafCluster={f.sc >= 1.2} />
            </div>
          ))}
          {/* Flower bushes at ground level on aisle right */}
          <div style={{ position: 'absolute', right: '3%', bottom: '1%', pointerEvents: 'none' }}>
            <FlowerBushSVG colors={['#D9A0AE', '#C4788A', '#E8B4C0']} />
          </div>
          <div style={{ position: 'absolute', right: '8%', bottom: '0%', pointerEvents: 'none' }}>
            <FlowerBushSVG colors={['#C4788A', '#D9A0AE', '#E8B4C0', '#C4788A']} />
          </div>
        </motion.div>

        {/* Hanging flower garlands from top of aisle */}
        <div style={{ position: 'absolute', top: '5%', left: '5%', right: '5%', pointerEvents: 'none', zIndex: 6, opacity: 0.60 }}>
          <HangingGarlandSVG width={400} color='#C4788A' />
        </div>

        {/* Layer 3: near flowers - larger, move outward faster */}
        <motion.div
          animate={nearLeftControls}
          initial={{ x: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }}
        >
          {NEAR_LEFT.map(f => (
            <div key={f.id} style={{
              position: 'absolute',
              left: f.x + '%',
              bottom: f.bot + '%',
              transform: 'translateX(-50%)',
            }}>
              <FlowerStemSVG scale={f.sc} color={f.c} swayDelay={f.sd} withLeafCluster />
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={nearRightControls}
          initial={{ x: 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }}
        >
          {NEAR_RIGHT.map(f => (
            <div key={f.id} style={{
              position: 'absolute',
              left: f.x + '%',
              bottom: f.bot + '%',
              transform: 'translateX(-50%)',
            }}>
              <FlowerStemSVG scale={f.sc} color={f.c} swayDelay={f.sd} withLeafCluster />
            </div>
          ))}
        </motion.div>

        {/* Layer 4: couple - center-bottom */}
        <motion.div
          animate={coupleControls}
          initial={{ scale: 1 }}
          style={{
            position: 'absolute',
            bottom: '4%', left: '50%',
            transform: 'translateX(-50%)',
            width: '52%', maxWidth: 300,
            zIndex: 10,
            transformOrigin: 'bottom center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coupleImg}
            alt='Pengantin'
            style={{
              width: '100%', height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(196,120,138,0.25))',
              display: 'block',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </motion.div>
      </motion.div>

      {/* Gate doors */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex',
          perspective: '1400px',
          zIndex: 30,
          pointerEvents: 'none',
        }}
      >
        {/* Left gate door */}
        <motion.div
          animate={gateLeftControls}
          initial={{ rotateY: 0 }}
          style={{
            width: '50%', height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
          }}
        >
          <GateDoor side='left' />
        </motion.div>

        {/* Right gate door */}
        <motion.div
          animate={gateRightControls}
          initial={{ rotateY: 0 }}
          style={{
            width: '50%', height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'right center',
          }}
        >
          <GateDoor side='right' />
        </motion.div>
      </div>

      {/* Falling petals - appear when gate opens */}
      <AnimatePresence>
        {showPetals && PETALS.map(p => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x + '%',
              top: '-5%',
              zIndex: 40,
              pointerEvents: 'none',
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
            <PetalSVG size={p.size} color={p.color} shape={p.shape} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Backdrop blur on gate (phase 1 only) */}
      {!gateOpen && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 29,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          pointerEvents: 'none',
        }} />
      )}
    </motion.div>
  )
}
