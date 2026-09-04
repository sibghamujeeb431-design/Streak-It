import { useMemo } from 'react'

interface TimerRingProps {
  mode: 'countdown' | 'countup'
  valueMs: number
  maxMs: number
  windowStartMs?: number
  windowEndMs?: number
  label?: string
  size?: number
  strokeWidth?: number
}

export function TimerRing({
  mode,
  valueMs,
  maxMs,
  windowStartMs,
  windowEndMs,
  label,
  size = 112,
  strokeWidth = 8,
}: TimerRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius])

  const progress = useMemo(() => {
    if (maxMs <= 0) return 0
    return Math.min(1, Math.max(0, valueMs / maxMs))
  }, [valueMs, maxMs])

  const dashOffset = circumference * (1 - progress)
  const displaySeconds = (valueMs / 1000).toFixed(1)

  const hasWindow = windowStartMs !== undefined && windowEndMs !== undefined

  const windowBand = useMemo(() => {
    if (!hasWindow || maxMs <= 0) return null
    const start = Math.min(1, Math.max(0, windowStartMs / maxMs)) * circumference
    const end = Math.min(1, Math.max(0, windowEndMs / maxMs)) * circumference
    const length = end - start
    return { start, length }
  }, [hasWindow, maxMs, windowStartMs, windowEndMs, circumference])

  const insideWindow = hasWindow
    ? valueMs >= windowStartMs! && valueMs <= windowEndMs!
    : false

  const arcColor = useMemo(() => {
    if (mode === 'countdown') return 'text-coral'
    if (!hasWindow) return 'text-teal'
    if (valueMs < windowStartMs!) return 'text-stone'
    if (valueMs <= windowEndMs!) return 'text-teal'
    return 'text-coral'
  }, [mode, hasWindow, valueMs, windowStartMs, windowEndMs])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-label={mode === 'countdown' ? 'Countdown timer' : 'Elapsed timer'}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="text-stone/10"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />

        {windowBand && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="text-teal/15"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${windowBand.length} ${circumference}`}
            strokeDashoffset={circumference - windowBand.start}
            strokeLinecap="butt"
          />
        )}

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={`${arcColor} ${insideWindow ? 'animate-ring-pulse' : ''}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 100ms linear, color 200ms ease' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-xl font-bold text-charcoal"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displaySeconds}s
        </span>
        {label && (
          <span className="text-[10px] uppercase tracking-wide text-stone">{label}</span>
        )}
      </div>
    </div>
  )
}
