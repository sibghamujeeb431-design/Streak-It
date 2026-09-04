import { useMemo } from 'react'
import type { StreakRegion, StreakingOutcome } from '../../data/streakPlate'

interface PlateViewProps {
  regions: StreakRegion[]
  outcome: StreakingOutcome | null
  grown: boolean
  size?: number
  label?: boolean
  activeRegion?: number
}

export function PlateView({
  regions,
  outcome,
  grown,
  size = 256,
  label = true,
  activeRegion,
}: PlateViewProps) {
  const resolvedOutcome = useMemo<StreakingOutcome>(() => {
    if (outcome) return outcome
    if (!grown) return 'correct'
    if (regions.some((_, i) => !regions[i]?.streaked)) return 'ineffective_pattern'
    if (regions.some((r) => r.carryover === 'heavy')) return 'poor_separation'
    return 'correct'
  }, [regions, outcome, grown])

  const viewBoxSize = 200
  const center = viewBoxSize / 2
  const plateRadius = 92
  const agarRadius = 84

  const quadrantCenters = useMemo(
    () => [
      { x: center + 36, y: center - 36 }, // region 0
      { x: center + 36, y: center + 36 }, // region 1
      { x: center - 36, y: center + 36 }, // region 2
      { x: center - 36, y: center - 36 }, // region 3
    ],
    [center],
  )

  const lines = useMemo(() => {
    const result: {
      region: number
      x1: number
      y1: number
      x2: number
      y2: number
      opacity: number
      width: number
    }[] = []

    for (let region = 0; region < 4; region += 1) {
      const streaked = regions[region]?.streaked ?? false
      const lineCount = streaked
        ? resolvedOutcome === 'ineffective_pattern'
          ? 3 + (region % 2)
          : 5 + region
        : 0

      for (let i = 0; i < lineCount; i += 1) {
        const q = quadrantCenters[region]
        const angleBase = region * 90 + 45
        const angleOffset = ((i * 7) % 17) - 8
        const angle = (angleBase + angleOffset) * (Math.PI / 180)
        const spread = 10 + (i % 4) * 3
        const length = resolvedOutcome === 'ineffective_pattern'
          ? 18 + ((i * 11) % 19)
          : 30 + ((i * 13) % 17)

        const x1 = q.x + Math.cos(angle) * spread * 0.3
        const y1 = q.y + Math.sin(angle) * spread * 0.3
        const x2 = q.x + Math.cos(angle) * length
        const y2 = q.y + Math.sin(angle) * length

        const densityFactor = resolvedOutcome === 'poor_separation'
          ? 1
          : 1 - region * 0.18

        result.push({
          region,
          x1,
          y1,
          x2,
          y2,
          opacity: 0.35 * densityFactor,
          width: 1.2 + (i % 3) * 0.3,
        })
      }
    }

    return result
  }, [regions, resolvedOutcome, quadrantCenters])

  const colonies = useMemo(() => {
    if (!grown) return []

    const result: { cx: number; cy: number; r: number; opacity: number }[] = []

    for (let region = 0; region < 4; region += 1) {
      const streaked = regions[region]?.streaked ?? false
      if (!streaked) continue

      const q = quadrantCenters[region]
      const count = resolvedOutcome === 'poor_separation'
        ? 22 - region * 2
        : resolvedOutcome === 'ineffective_pattern'
          ? 6 + (region % 3) * 4
          : resolvedOutcome === 'contaminated'
            ? 18 - region * 3
            : [26, 16, 8, 4][region]

      for (let i = 0; i < count; i += 1) {
        const angle = (region * 90 + 20 + ((i * 47) % 70)) * (Math.PI / 180)
        const distance = 8 + ((i * 19) % 32)
        const cx = q.x + Math.cos(angle) * distance
        const cy = q.y + Math.sin(angle) * distance
        const r = 1.2 + (i % 3) * 0.5
        const opacity = 0.5 + ((i % 5) * 0.1)
        result.push({ cx, cy, r, opacity })
      }
    }

    if (resolvedOutcome === 'contaminated') {
      for (let i = 0; i < 18; i += 1) {
        const angle = ((i * 71) % 360) * (Math.PI / 180)
        const distance = 20 + ((i * 13) % 55)
        const cx = center + Math.cos(angle) * distance
        const cy = center + Math.sin(angle) * distance
        result.push({ cx, cy, r: 1.4 + (i % 3) * 0.4, opacity: 0.75 })
      }
    }

    return result
  }, [grown, regions, resolvedOutcome, quadrantCenters, center])

  const outcomeLabel = useMemo(() => {
    switch (resolvedOutcome) {
      case 'correct':
        return 'Isolated colonies'
      case 'poor_separation':
        return 'Crowded growth'
      case 'ineffective_pattern':
        return 'Uneven streaking'
      case 'contaminated':
        return 'Contaminated plate'
      default:
        return ''
    }
  }, [resolvedOutcome])

  return (
    <div className="flex flex-col items-center animate-iris-open">
      <div
        className="relative rounded-full shadow-2xl"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full animate-field-settle"
        >
          <defs>
            <radialGradient id="agarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDF8F0" />
              <stop offset="85%" stopColor="#F4EFE6" />
              <stop offset="100%" stopColor="#E8E3DC" />
            </radialGradient>
            <filter id="softShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
            </filter>
          </defs>

          <circle
            cx={center}
            cy={center}
            r={plateRadius}
            fill="#FAF8F5"
            stroke="#D8D3CC"
            strokeWidth={3}
          />

          <circle
            cx={center}
            cy={center}
            r={agarRadius}
            fill="url(#agarFill)"
            stroke="#E0DBD3"
            strokeWidth={1}
          />

          {activeRegion !== undefined && activeRegion >= 0 && activeRegion < 4 && (
            <circle
              cx={quadrantCenters[activeRegion].x}
              cy={quadrantCenters[activeRegion].y}
              r={38}
              fill="none"
              stroke="#C96A45"
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={0.5}
            />
          )}

          {lines.map((line, index) => (
            <line
              key={`line-${index}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#A89B8C"
              strokeWidth={line.width}
              opacity={line.opacity}
              strokeLinecap="round"
            />
          ))}

          {colonies.map((colony, index) => (
            <circle
              key={`colony-${index}`}
              cx={colony.cx}
              cy={colony.cy}
              r={colony.r}
              fill="#C99E7C"
              opacity={colony.opacity}
              filter="url(#softShadow)"
            />
          ))}

          <circle
            cx={center}
            cy={center}
            r={agarRadius}
            fill="none"
            stroke="rgba(0,0,0,0.04)"
            strokeWidth={1}
          />
        </svg>
      </div>

      {label && grown && (
        <div className="mt-4 text-center" style={{ maxWidth: size }}>
          <p className="text-sm font-semibold text-charcoal">{outcomeLabel}</p>
        </div>
      )}
    </div>
  )
}
