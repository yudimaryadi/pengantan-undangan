// components/ui/FloralDivider.tsx
// Divider bunga melati sebagai pemisah antar section atau elemen
// Requirements: 8.3

interface FloralDividerProps {
  className?: string
}

export function FloralDivider({ className = '' }: FloralDividerProps) {
  return (
    <div
      className={`flex items-center justify-center my-6 ${className}`}
      aria-hidden="true"
    >
      <div className="flex-1 h-px bg-sumbawa-gold opacity-40" />
      <div className="mx-4">
        <svg
          viewBox="0 0 60 60"
          className="w-10 h-10 text-sumbawa-gold"
          fill="currentColor"
        >
          {/* Bunga melati — 8 kelopak */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const cx = 30 + 12 * Math.sin(angle)
            const cy = 30 - 12 * Math.cos(angle)
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx="4"
                ry="7"
                transform={`rotate(${i * 45}, ${cx}, ${cy})`}
                opacity="0.85"
              />
            )
          })}
          {/* Pusat bunga */}
          <circle cx="30" cy="30" r="6" fill="currentColor" />
          <circle cx="30" cy="30" r="3" fill="#F5EDD6" />
        </svg>
      </div>
      <div className="flex-1 h-px bg-sumbawa-gold opacity-40" />
    </div>
  )
}
