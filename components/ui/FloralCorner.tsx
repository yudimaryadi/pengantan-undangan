// Floral corner decoration — roses & leaves

interface FloralCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FloralCorner({ position, className = '', size = 'md' }: FloralCornerProps) {
  const sizeMap = { sm: 80, md: 120, lg: 160 }
  const s = sizeMap[size]

  const transforms = {
    'top-left': '',
    'top-right': 'scale(-1,1)',
    'bottom-left': 'scale(1,-1)',
    'bottom-right': 'scale(-1,-1)',
  }

  return (
    <div
      className={`absolute ${position.includes('top') ? 'top-0' : 'bottom-0'} ${position.includes('left') ? 'left-0' : 'right-0'} pointer-events-none ${className}`}
      style={{ width: s, height: s, transform: transforms[position] }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full opacity-40">
        {/* Main rose */}
        <g transform="translate(25, 25)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180
            return (
              <ellipse key={a}
                cx={Math.cos(r) * 14} cy={Math.sin(r) * 14}
                rx="8" ry="12"
                transform={`rotate(${a}, ${Math.cos(r) * 14}, ${Math.sin(r) * 14})`}
                fill="#C4788A" fillOpacity="0.6"
              />
            )
          })}
          {[0, 72, 144, 216, 288].map((a) => {
            const r = (a * Math.PI) / 180
            return (
              <ellipse key={a}
                cx={Math.cos(r) * 7} cy={Math.sin(r) * 7}
                rx="5" ry="8"
                transform={`rotate(${a}, ${Math.cos(r) * 7}, ${Math.sin(r) * 7})`}
                fill="#D9A0AE" fillOpacity="0.8"
              />
            )
          })}
          <circle r="4" fill="#F2DDE2" />
          <circle r="2" fill="#B8965A" fillOpacity="0.5" />
        </g>

        {/* Stem */}
        <path d="M25,40 Q35,60 30,80 Q25,95 28,110" stroke="#7A8A5A" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />

        {/* Leaves */}
        {[
          { x: 32, y: 55, r: 25 },
          { x: 24, y: 75, r: -30 },
          { x: 30, y: 95, r: 20 },
        ].map((leaf, i) => (
          <g key={i} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r})`}>
            <ellipse rx="8" ry="4" fill="#8A9E6A" fillOpacity="0.5" />
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#6A7A4A" strokeWidth="0.8" strokeOpacity="0.4" />
          </g>
        ))}

        {/* Small accent flowers */}
        {[
          { x: 55, y: 15, s: 5 },
          { x: 15, y: 55, s: 4 },
        ].map((f, i) => (
          <g key={i} transform={`translate(${f.x}, ${f.y})`}>
            {[0, 72, 144, 216, 288].map((a) => {
              const r = (a * Math.PI) / 180
              return (
                <ellipse key={a}
                  cx={Math.cos(r) * f.s} cy={Math.sin(r) * f.s}
                  rx={f.s * 0.6} ry={f.s * 0.9}
                  transform={`rotate(${a}, ${Math.cos(r) * f.s}, ${Math.sin(r) * f.s})`}
                  fill="#D9A0AE" fillOpacity="0.6"
                />
              )
            })}
            <circle r={f.s * 0.4} fill="#F2DDE2" fillOpacity="0.8" />
          </g>
        ))}

        {/* Gold sparkles */}
        {[
          { x: 45, y: 8 }, { x: 8, y: 45 }, { x: 65, y: 35 },
        ].map((p, i) => (
          <path key={i} transform={`translate(${p.x}, ${p.y})`}
            d="M0,-2.5 L0.5,-0.5 L2.5,0 L0.5,0.5 L0,2.5 L-0.5,0.5 L-2.5,0 L-0.5,-0.5 Z"
            fill="#B8965A" fillOpacity="0.4" />
        ))}
      </svg>
    </div>
  )
}
