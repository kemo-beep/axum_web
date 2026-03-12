interface CreditRingProps {
  /** Credits remaining (current balance) */
  remaining: number
  /** Credits consumed (total usage) */
  consumed: number
  size?: number
  strokeWidth?: number
  className?: string
}

/**
 * Circular progress ring showing consumed vs remaining credits.
 * Filled portion = remaining, unfilled = consumed (when total > 0).
 */
export function CreditRing({
  remaining,
  consumed,
  size = 48,
  strokeWidth = 4,
  className = '',
}: CreditRingProps) {
  const total = remaining + consumed
  const remainingPercent =
    total > 0 ? Math.min(100, (remaining / total) * 100) : remaining > 0 ? 100 : 0
  const circumference = 2 * Math.PI * ((size / 2) - strokeWidth)
  const offset = circumference - (remainingPercent / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          fill="none"
          stroke="var(--line)"
          strokeWidth={strokeWidth}
        />
        {/* Filled arc (remaining) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          fill="none"
          stroke="var(--lagoon)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
    </div>
  )
}
