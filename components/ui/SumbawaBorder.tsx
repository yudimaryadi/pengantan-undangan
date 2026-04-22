// components/ui/SumbawaBorder.tsx
// SVG border dengan motif geometris diamond chain khas Sumbawa
// Requirements: 2.3, 8.3

interface SumbawaBorderProps {
  position?: 'top' | 'bottom'
  className?: string
}

export function SumbawaBorder({ position = 'bottom', className = '' }: SumbawaBorderProps) {
  const diamonds = Array.from({ length: 40 }, (_, i) => i * 30)

  return (
    <div
      className={`w-full ${position === 'top' ? 'rotate-180' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 60"
        className="w-full text-sumbawa-gold fill-current"
        preserveAspectRatio="none"
      >
        {/* Horizontal lines */}
        <line x1="0" y1="5" x2="1200" y2="5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="55" x2="1200" y2="55" stroke="currentColor" strokeWidth="1.5" />

        {/* Diamond chain motif */}
        {diamonds.map((x) => (
          <path
            key={x}
            d={`M${x},30 L${x + 15},10 L${x + 30},30 L${x + 15},50 Z`}
          />
        ))}
      </svg>
    </div>
  )
}
