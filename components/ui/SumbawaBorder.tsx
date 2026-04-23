// SumbawaBorder — elegant thin line with diamond accents

interface SumbawaBorderProps {
  position?: 'top' | 'bottom'
  className?: string
  variant?: 'full' | 'short'
  color?: 'rose' | 'gold'
}

export function SumbawaBorder({ position = 'bottom', className = '', variant = 'full', color = 'rose' }: SumbawaBorderProps) {
  const c = color === 'rose' ? '#C4788A' : '#B8965A'

  if (variant === 'short') {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
        <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c}50)` }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: c, opacity: 0.6 }} />
        <div className="h-px w-24" style={{ background: c, opacity: 0.25 }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: c, opacity: 0.6 }} />
        <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c}50)` }} />
      </div>
    )
  }

  return (
    <div
      className={`w-full overflow-hidden ${position === 'top' ? 'scale-y-[-1]' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 800 20" className="w-full" preserveAspectRatio="none" fill="none">
        <line x1="0" y1="10" x2="800" y2="10" stroke={c} strokeWidth="0.5" strokeOpacity="0.3" />
        {[60, 160, 260, 400, 540, 640, 740].map((x) => (
          <path key={x} d={`M${x},10 L${x + 5},5 L${x + 10},10 L${x + 5},15 Z`}
            fill={c} fillOpacity="0.45" />
        ))}
        <line x1="0" y1="3" x2="800" y2="3" stroke={c} strokeWidth="0.3" strokeOpacity="0.15" />
        <line x1="0" y1="17" x2="800" y2="17" stroke={c} strokeWidth="0.3" strokeOpacity="0.15" />
      </svg>
    </div>
  )
}
