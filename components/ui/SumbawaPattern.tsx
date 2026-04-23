// SumbawaPattern — subtle dot pattern for light backgrounds

interface SumbawaPatternProps {
  opacity?: number
  className?: string
  color?: 'rose' | 'gold'
}

export function SumbawaPattern({ opacity = 0.04, className = '', color = 'rose' }: SumbawaPatternProps) {
  const c = color === 'rose' ? '%23C4788A' : '%23B8965A'
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1' fill='${c}'/%3E%3C/svg%3E")`,
        backgroundSize: '32px 32px',
        opacity,
      }}
    />
  )
}
