import { useMemo } from 'react'

interface SerialDilutionPlateViewProps {
  plateResult: {
    countable: boolean
    colonyCount: number | null
    visualState: 'optimal' | 'overcrowded' | 'sparse' | 'inconsistent'
  } | null
  size?: number
  label?: boolean
}

// Seeded random for consistent rendering
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function SerialDilutionPlateView({
  plateResult,
  size = 280,
  label = true,
}: SerialDilutionPlateViewProps) {
  const viewBoxSize = 200
  const center = viewBoxSize / 2
  const plateRadius = 92
  const agarRadius = 84

  const colonies = useMemo(() => {
    if (!plateResult || !plateResult.countable) {
      // For non-countable plates (overcrowded), render a lawn
      if (plateResult?.visualState === 'overcrowded') {
        const result: { cx: number; cy: number; r: number; opacity: number }[] = []
        const count = 350
        for (let i = 0; i < count; i += 1) {
          const angle = ((i * 73) % 360) * (Math.PI / 180)
          const distance = seededRandom(i) * agarRadius * 0.9
          const cx = center + Math.cos(angle) * distance
          const cy = center + Math.sin(angle) * distance
          const r = 0.8 + seededRandom(i + 1000) * 0.6
          const opacity = 0.4 + seededRandom(i + 2000) * 0.3
          result.push({ cx, cy, r, opacity })
        }
        return result
      }
      // For sparse plates, render very few colonies
      if (plateResult?.visualState === 'sparse') {
        const result: { cx: number; cy: number; r: number; opacity: number }[] = []
        const count = 3 + Math.floor(seededRandom(5000) * 5)
        for (let i = 0; i < count; i += 1) {
          const angle = ((i * 97) % 360) * (Math.PI / 180)
          const distance = 10 + seededRandom(i + 3000) * 40
          const cx = center + Math.cos(angle) * distance
          const cy = center + Math.sin(angle) * distance
          const r = 1.2 + seededRandom(i + 4000) * 0.8
          const opacity = 0.5 + seededRandom(i + 5000) * 0.2
          result.push({ cx, cy, r, opacity })
        }
        return result
      }
      return []
    }

    // For countable plates, render the specific colony count
    const count = plateResult.colonyCount ?? 87
    const result: { cx: number; cy: number; r: number; opacity: number }[] = []

    for (let i = 0; i < count; i += 1) {
      // Distribute colonies across the plate
      const angle = ((i * 137) % 360) * (Math.PI / 180)
      const distance = 15 + ((i * 53) % 60)
      const cx = center + Math.cos(angle) * distance
      const cy = center + Math.sin(angle) * distance
      const r = 1.2 + (i % 4) * 0.4
      const opacity = 0.5 + ((i % 5) * 0.1)
      result.push({ cx, cy, r, opacity })
    }

    return result
  }, [plateResult, center, agarRadius])

  const outcomeLabel = useMemo(() => {
    if (!plateResult) return ''
    if (!plateResult.countable) {
      if (plateResult.visualState === 'overcrowded') return 'Too concentrated - lawn growth'
      if (plateResult.visualState === 'sparse') return 'Too dilute - insufficient colonies'
      return 'Not countable'
    }
    return `Countable: ${plateResult.colonyCount} colonies`
  }, [plateResult])

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

      {label && plateResult && (
        <div className="mt-4 text-center" style={{ maxWidth: size }}>
          <p className="text-sm font-semibold text-charcoal">{outcomeLabel}</p>
        </div>
      )}
    </div>
  )
}
