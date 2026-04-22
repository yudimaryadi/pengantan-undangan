// components/ui/SumbawaPattern.tsx
// Background pattern tenun Tembe Nggoli sebagai CSS/SVG pattern
// Requirements: 2.5, 8.3

interface SumbawaPatternProps {
  opacity?: number
  className?: string
}

export function SumbawaPattern({ opacity = 0.08, className = '' }: SumbawaPatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        backgroundImage: `url('/ornaments/tembe-pattern.svg')`,
        backgroundSize: '120px 120px',
        backgroundRepeat: 'repeat',
        opacity,
      }}
    />
  )
}
