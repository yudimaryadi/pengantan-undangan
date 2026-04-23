// FloralDivider — elegant rose divider between sections

interface FloralDividerProps {
  className?: string
  variant?: 'rose' | 'gold' | 'minimal'
}

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
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const r = (a * Math.PI) / 180
            return (
              <ellipse key={a}
                cx={Math.cos(r) * 5} cy={Math.sin(r) * 5}
                rx="3" ry="5"
                transform={`rotate(${a}, ${Math.cos(r) * 5}, ${Math.sin(r) * 5})`}
                fill={c.petal} fillOpacity="0.7"
              />
            )
          })}
          <circle r="2.5" fill={c.center} fillOpacity="0.6" />
        </g>

        {/* Center large rose */}
        <g transform="translate(40, 16)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180
            return (
              <ellipse key={a}
                cx={Math.cos(r) * 7} cy={Math.sin(r) * 7}
                rx="4" ry="6.5"
                transform={`rotate(${a}, ${Math.cos(r) * 7}, ${Math.sin(r) * 7})`}
                fill={c.petal} fillOpacity="0.75"
              />
            )
          })}
          {[0, 72, 144, 216, 288].map((a) => {
            const r = (a * Math.PI) / 180
            return (
              <ellipse key={a}
                cx={Math.cos(r) * 3.5} cy={Math.sin(r) * 3.5}
                rx="2.5" ry="4"
                transform={`rotate(${a}, ${Math.cos(r) * 3.5}, ${Math.sin(r) * 3.5})`}
                fill={c.center} fillOpacity="0.8"
              />
            )
          })}
          <circle r="2" fill={c.center} />
        </g>

        {/* Right mini rose */}
        <g transform="translate(64, 16)">
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const r = (a * Math.PI) / 180
            return (
              <ellipse key={a}
                cx={Math.cos(r) * 5} cy={Math.sin(r) * 5}
                rx="3" ry="5"
                transform={`rotate(${a}, ${Math.cos(r) * 5}, ${Math.sin(r) * 5})`}
                fill={c.petal} fillOpacity="0.7"
              />
            )
          })}
          <circle r="2.5" fill={c.center} fillOpacity="0.6" />
        </g>

        {/* Leaves between roses */}
        <g transform="translate(28, 16) rotate(-20)">
          <ellipse rx="5" ry="2.5" fill={c.leaf} fillOpacity="0.5" />
        </g>
        <g transform="translate(52, 16) rotate(20)">
          <ellipse rx="5" ry="2.5" fill={c.leaf} fillOpacity="0.5" />
        </g>

        {/* Gold dots */}
        <circle cx="6" cy="16" r="1.5" fill={c.center} fillOpacity="0.3" />
        <circle cx="74" cy="16" r="1.5" fill={c.center} fillOpacity="0.3" />
      </svg>

      {/* Right line */}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${c.line})` }} />
    </div>
  )
}
