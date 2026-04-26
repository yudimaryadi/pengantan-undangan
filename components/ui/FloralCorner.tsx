// Floral corner decoration — roses & leaves
// All coordinates are pre-computed constants to avoid SSR hydration mismatch
// from floating point differences between Node.js and browser Math.cos/sin

interface FloralCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// Pre-computed: cos/sin for [0, 45, 90, 135, 180, 225, 270, 315] degrees * 14
// rounded to 3 decimal places
const OUTER_PETALS = [
  { cx: 14,      cy: 0,      a: 0   },
  { cx: 9.899,   cy: 9.899,  a: 45  },
  { cx: 0,       cy: 14,     a: 90  },
  { cx: -9.899,  cy: 9.899,  a: 135 },
  { cx: -14,     cy: 0,      a: 180 },
  { cx: -9.899,  cy: -9.899, a: 225 },
  { cx: 0,       cy: -14,    a: 270 },
  { cx: 9.899,   cy: -9.899, a: 315 },
]

// Pre-computed: cos/sin for [0, 72, 144, 216, 288] degrees * 7
const INNER_PETALS = [
  { cx: 7,      cy: 0,      a: 0   },
  { cx: 2.163,  cy: 6.657,  a: 72  },
  { cx: -5.663, cy: 4.114,  a: 144 },
  { cx: -5.663, cy: -4.114, a: 216 },
  { cx: 2.163,  cy: -6.657, a: 288 },
]

// Pre-computed: cos/sin for [0, 72, 144, 216, 288] degrees * 5 (small flowers)
const SMALL_PETALS_5 = [
  { cx: 5,      cy: 0,      a: 0   },
  { cx: 1.545,  cy: 4.755,  a: 72  },
  { cx: -4.045, cy: 2.939,  a: 144 },
  { cx: -4.045, cy: -2.939, a: 216 },
  { cx: 1.545,  cy: -4.755, a: 288 },
]

// Pre-computed: cos/sin for [0, 72, 144, 216, 288] degrees * 4 (small flowers)
const SMALL_PETALS_4 = [
  { cx: 4,      cy: 0,      a: 0   },
  { cx: 1.236,  cy: 3.804,  a: 72  },
  { cx: -3.236, cy: 2.351,  a: 144 },
  { cx: -3.236, cy: -2.351, a: 216 },
  { cx: 1.236,  cy: -3.804, a: 288 },
]

export function FloralCorner({ position, className = '', size = 'md' }: FloralCornerProps) {
  const sizeMap = { sm: 80, md: 120, lg: 160 }
  const s = sizeMap[size]

  const transforms = {
    'top-left':     '',
    'top-right':    'scale(-1,1)',
    'bottom-left':  'scale(1,-1)',
    'bottom-right': 'scale(-1,-1)',
  }

  return (
    <div
      className={`absolute ${position.includes('top') ? 'top-0' : 'bottom-0'} ${position.includes('left') ? 'left-0' : 'right-0'} pointer-events-none ${className}`}
      style={{ width: s, height: s, transform: transforms[position] }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full opacity-40">

        {/* Main rose — outer petals */}
        <g transform="translate(25, 25)">
          {OUTER_PETALS.map(({ cx, cy, a }) => (
            <ellipse key={a}
              cx={cx} cy={cy}
              rx="8" ry="12"
              transform={`rotate(${a}, ${cx}, ${cy})`}
              fill="#C4788A" fillOpacity="0.6"
            />
          ))}

          {/* Inner petals */}
          {INNER_PETALS.map(({ cx, cy, a }) => (
            <ellipse key={a}
              cx={cx} cy={cy}
              rx="5" ry="8"
              transform={`rotate(${a}, ${cx}, ${cy})`}
              fill="#D9A0AE" fillOpacity="0.8"
            />
          ))}

          <circle r="4" fill="#F2DDE2" />
          <circle r="2" fill="#B8965A" fillOpacity="0.5" />
        </g>

        {/* Stem */}
        <path d="M25,40 Q35,60 30,80 Q25,95 28,110"
          stroke="#7A8A5A" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />

        {/* Leaves */}
        <g transform="translate(32, 55) rotate(25)">
          <ellipse rx="8" ry="4" fill="#8A9E6A" fillOpacity="0.5" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#6A7A4A" strokeWidth="0.8" strokeOpacity="0.4" />
        </g>
        <g transform="translate(24, 75) rotate(-30)">
          <ellipse rx="8" ry="4" fill="#8A9E6A" fillOpacity="0.5" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#6A7A4A" strokeWidth="0.8" strokeOpacity="0.4" />
        </g>
        <g transform="translate(30, 95) rotate(20)">
          <ellipse rx="8" ry="4" fill="#8A9E6A" fillOpacity="0.5" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#6A7A4A" strokeWidth="0.8" strokeOpacity="0.4" />
        </g>

        {/* Small accent flower at (55, 15) — size 5 */}
        <g transform="translate(55, 15)">
          {SMALL_PETALS_5.map(({ cx, cy, a }) => (
            <ellipse key={a}
              cx={cx} cy={cy}
              rx="3" ry="4.5"
              transform={`rotate(${a}, ${cx}, ${cy})`}
              fill="#D9A0AE" fillOpacity="0.6"
            />
          ))}
          <circle r="2" fill="#F2DDE2" fillOpacity="0.8" />
        </g>

        {/* Small accent flower at (15, 55) — size 4 */}
        <g transform="translate(15, 55)">
          {SMALL_PETALS_4.map(({ cx, cy, a }) => (
            <ellipse key={a}
              cx={cx} cy={cy}
              rx="2.4" ry="3.6"
              transform={`rotate(${a}, ${cx}, ${cy})`}
              fill="#D9A0AE" fillOpacity="0.6"
            />
          ))}
          <circle r="1.6" fill="#F2DDE2" fillOpacity="0.8" />
        </g>

        {/* Gold sparkles */}
        <path transform="translate(45, 8)"
          d="M0,-2.5 L0.5,-0.5 L2.5,0 L0.5,0.5 L0,2.5 L-0.5,0.5 L-2.5,0 L-0.5,-0.5 Z"
          fill="#B8965A" fillOpacity="0.4" />
        <path transform="translate(8, 45)"
          d="M0,-2.5 L0.5,-0.5 L2.5,0 L0.5,0.5 L0,2.5 L-0.5,0.5 L-2.5,0 L-0.5,-0.5 Z"
          fill="#B8965A" fillOpacity="0.4" />
        <path transform="translate(65, 35)"
          d="M0,-2.5 L0.5,-0.5 L2.5,0 L0.5,0.5 L0,2.5 L-0.5,0.5 L-2.5,0 L-0.5,-0.5 Z"
          fill="#B8965A" fillOpacity="0.4" />

      </svg>
    </div>
  )
}
