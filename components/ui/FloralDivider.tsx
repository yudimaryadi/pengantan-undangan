// FloralDivider — elegant rose divider between sections
// All coordinates pre-computed to avoid SSR hydration mismatch

interface FloralDividerProps {
  className?: string
  variant?: 'rose' | 'gold' | 'minimal'
}

// Pre-computed: [0, 60, 120, 180, 240, 300] * 5 — mini rose petals
const MINI_PETALS = [
  { cx: 5,      cy: 0,      a: 0   },
  { cx: 2.5,    cy: 4.330,  a: 60  },
  { cx: -2.5,   cy: 4.330,  a: 120 },
  { cx: -5,     cy: 0,      a: 180 },
  { cx: -2.5,   cy: -4.330, a: 240 },
  { cx: 2.5,    cy: -4.330, a: 300 },
]

// Pre-computed: [0, 45, 90, 135, 180, 225, 270, 315] * 7 — large rose outer petals
const LARGE_OUTER = [
  { cx: 7,      cy: 0,      a: 0   },
  { cx: 4.950,  cy: 4.950,  a: 45  },
  { cx: 0,      cy: 7,      a: 90  },
  { cx: -4.950, cy: 4.950,  a: 135 },
  { cx: -7,     cy: 0,      a: 180 },
  { cx: -4.950, cy: -4.950, a: 225 },
  { cx: 0,      cy: -7,     a: 270 },
  { cx: 4.950,  cy: -4.950, a: 315 },
]

// Pre-computed: [0, 72, 144, 216, 288] * 3.5 — large rose inner petals
const LARGE_INNER = [
  { cx: 3.5,    cy: 0,      a: 0   },
  { cx: 1.081,  cy: 3.329,  a: 72  },
  { cx: -2.832, cy: 2.057,  a: 144 },
  { cx: -2.832, cy: -2.057, a: 216 },
  { cx: 1.081,  cy: -3.329, a: 288 },
]

export function FloralDivider({ className = '', variant = 'rose' }: FloralDividerProps) {
  const colors = {
    rose:    { line: '#E8D4D8', center: '#C4788A', petal: '#D9A0AE', leaf: '#8A9E6A' },
    gold:    { line: '#E8D8C0', center: '#B8965A', petal: '#D4B47A', leaf: '#8A9E6A' },
    minimal: { line: '#E8D4D8', center: '#C4A8B0', petal: '#D9C0C8', leaf: '#A8B89C' },
  }
  const c = colors[variant]

  return (
    <div className={`flex items-center justify-center gap-0 my-8 ${className}`} aria-hidden="true">
      {/* Left line */}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.line})` }} />

      {/* Center floral motif */}
      <svg width="80" height="32" viewBox="0 0 80 32" fill="none">

        {/* Left mini rose */}
        <g transform="translate(16, 16)">
          {MINI_PETALS.map(({ cx, cy, a }) => (
            <ellipse key={a} cx={cx} cy={cy} rx="3" ry="5"
              transform={`rotate(${a}, ${cx}, ${cy})`}
              fill={c.petal} fillOpacity="0.7" />
          ))}
          <circle r="2.5" fill={c.center} fillOpacity="0.6" />
        </g>

        {/* Center large rose */}
        <g transform="translate(40, 16)">
          {LARGE_OUTER.map(({ cx, cy, a }) => (
            <ellipse key={a} cx={cx} cy={cy} rx="4" ry="6.5"
              transform={`rotate(${a}, ${cx}, ${cy})`}
              fill={c.petal} fillOpacity="0.75" />
          ))}
          {LARGE_INNER.map(({ cx, cy, a }) => (
            <ellipse key={a} cx={cx} cy={cy} rx="2.5" ry="4"
              transform={`rotate(${a}, ${cx}, ${cy})`}
              fill={c.center} fillOpacity="0.8" />
          ))}
          <circle r="2" fill={c.center} />
        </g>

        {/* Right mini rose */}
        <g transform="translate(64, 16)">
          {MINI_PETALS.map(({ cx, cy, a }) => (
            <ellipse key={a} cx={cx} cy={cy} rx="3" ry="5"
              transform={`rotate(${a}, ${cx}, ${cy})`}
              fill={c.petal} fillOpacity="0.7" />
          ))}
          <circle r="2.5" fill={c.center} fillOpacity="0.6" />
        </g>

        {/* Leaves */}
        <g transform="translate(28, 16) rotate(-20)">
          <ellipse rx="5" ry="2.5" fill={c.leaf} fillOpacity="0.5" />
        </g>
        <g transform="translate(52, 16) rotate(20)">
          <ellipse rx="5" ry="2.5" fill={c.leaf} fillOpacity="0.5" />
        </g>

        {/* Dots */}
        <circle cx="6" cy="16" r="1.5" fill={c.center} fillOpacity="0.3" />
        <circle cx="74" cy="16" r="1.5" fill={c.center} fillOpacity="0.3" />
      </svg>

      {/* Right line */}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${c.line})` }} />
    </div>
  )
}
