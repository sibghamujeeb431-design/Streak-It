import { useMemo } from 'react'
import type { DiscId, InoculationQuality } from '../../data/ast'
import { getDisc, measuredZoneMm } from '../../data/ast'

interface AstPlateViewProps {
  placedDiscs: DiscId[]
  quality: InoculationQuality | null
  grown: boolean
  size?: number
  label?: boolean
  showMeasurements?: boolean
}

const DISC_POSITIONS = [
  { x: 100, y: 54 },
  { x: 143.7, y: 85.8 },
  { x: 127, y: 137.2 },
  { x: 73, y: 137.2 },
  { x: 56.3, y: 85.8 },
]

export function AstPlateView({
  placedDiscs,
  quality,
  grown,
  size = 280,
  label = true,
  showMeasurements = false,
}: AstPlateViewProps) {
  const resolvedQuality = quality ?? 'even'

  const zones = useMemo(() => {
    return placedDiscs.map((id, index) => {
      const disc = getDisc(id)
      const zoneMm = measuredZoneMm(disc, resolvedQuality)
      const position = DISC_POSITIONS[index]
      const baseRadius = zoneMm * 1.0
      const distort = resolvedQuality === 'uneven'
      return {
        id,
        code: disc.code,
        zoneMm,
        cx: position.x + (distort ? ((index * 7) % 9) - 4 : 0),
        cy: position.y + (distort ? ((index * 11) % 8) - 4 : 0),
        rx: distort ? baseRadius * (0.82 + index * 0.06) : baseRadius,
        ry: distort ? baseRadius * (1.12 + index * 0.04) : baseRadius,
        rotation: distort ? index * 41 : 0,
        distort,
      }
    })
  }, [placedDiscs, resolvedQuality])

  const lawnDots = useMemo(() => {
    if (quality === null) return []

    const result: { cx: number; cy: number; r: number; opacity: number }[] = []
    for (let i = 0; i < 170; i += 1) {
      const angle = ((i * 137.5) % 360) * (Math.PI / 180)
      const distance = 6 + ((i * 29) % 74)
      const cx = 100 + Math.cos(angle) * distance
      const cy = 100 + Math.sin(angle) * distance
      const patchFactor =
        resolvedQuality === 'uneven' ? 0.25 + 0.75 * Math.abs(Math.sin(i * 3.1)) : 1
      result.push({
        cx,
        cy,
        r: 0.8,
        opacity: 0.35 * patchFactor,
      })
    }
    return result
  }, [quality, resolvedQuality])

  const lawnBlobs = useMemo(() => {
    if (quality !== 'uneven') return []
    const result: { cx: number; cy: number; rx: number; ry: number; rotation: number }[] = []
    for (let i = 0; i < 7; i += 1) {
      const angle = (i * 51) * (Math.PI / 180)
      const distance = 18 + ((i * 17) % 52)
      result.push({
        cx: 100 + Math.cos(angle) * distance,
        cy: 100 + Math.sin(angle) * distance,
        rx: 20 + ((i * 13) % 18),
        ry: 14 + ((i * 7) % 14),
        rotation: i * 23,
      })
    }
    return result
  }, [quality])

  const qualityLabel = quality === 'uneven' ? 'Uneven lawn' : 'Even lawn'

  return (
    <div className="flex flex-col items-center animate-iris-open">
      <div
        className="relative rounded-full shadow-2xl"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full animate-field-settle"
        >
          <defs>
            <radialGradient id="astAgarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDF8F0" />
              <stop offset="85%" stopColor="#F4EFE6" />
              <stop offset="100%" stopColor="#E8E3DC" />
            </radialGradient>
            <radialGradient id="astZoneSoft" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F7F1E8" />
              <stop offset="82%" stopColor="#F7F1E8" />
              <stop offset="100%" stopColor="#F7F1E8" stopOpacity="0" />
            </radialGradient>
            <filter id="astSoftShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
            </filter>
          </defs>

          <circle
            cx={100}
            cy={100}
            r={92}
            fill="#FAF8F5"
            stroke="#D8D3CC"
            strokeWidth={3}
          />

          <circle
            cx={100}
            cy={100}
            r={84}
            fill="url(#astAgarFill)"
            stroke="#E0DBD3"
            strokeWidth={1}
          />

          {quality !== null && (
            <circle
              cx={100}
              cy={100}
              r={84}
              fill={
                resolvedQuality === 'uneven'
                  ? 'rgba(201,158,124,0.10)'
                  : 'rgba(201,158,124,0.22)'
              }
            />
          )}

          {lawnBlobs.map((blob, index) => (
            <ellipse
              key={`blob-${index}`}
              cx={blob.cx}
              cy={blob.cy}
              rx={blob.rx}
              ry={blob.ry}
              transform={`rotate(${blob.rotation} ${blob.cx} ${blob.cy})`}
              fill="rgba(201,158,124,0.20)"
            />
          ))}

          {lawnDots.map((dot, index) => (
            <circle
              key={`dot-${index}`}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill="#C99E7C"
              opacity={dot.opacity}
            />
          ))}

          {grown &&
            zones.map((zone) => (
              <ellipse
                key={`zone-${zone.id}`}
                cx={zone.cx}
                cy={zone.cy}
                rx={zone.rx}
                ry={zone.ry}
                transform={`rotate(${zone.rotation} ${zone.cx} ${zone.cy})`}
                fill={zone.distort ? 'url(#astZoneSoft)' : '#F7F1E8'}
                stroke={zone.distort ? '#D9CFC0' : '#D9CFC0'}
                strokeWidth={0.75}
                strokeDasharray={zone.distort ? '3 2' : undefined}
              />
            ))}

          {placedDiscs.map((id, index) => {
            const position = DISC_POSITIONS[index]
            const disc = getDisc(id)
            return (
              <g key={`disc-${id}`}>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={8}
                  fill="#FFFFFF"
                  stroke="#C4BBAE"
                  strokeWidth={1}
                  filter="url(#astSoftShadow)"
                />
                <text
                  x={position.x}
                  y={position.y + 1.8}
                  textAnchor="middle"
                  fontSize={5}
                  fontWeight={700}
                  fill="#5B5148"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {disc.code.split(' ')[0]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {label && quality !== null && (
        <div className="mt-4 text-center" style={{ maxWidth: size * 1.4 }}>
          <p className="text-sm font-semibold text-charcoal">{qualityLabel}</p>
        </div>
      )}

      {showMeasurements && grown && (
        <div
          className="mt-3 flex flex-wrap justify-center gap-2"
          style={{ maxWidth: size * 1.6 }}
        >
          {zones.map((zone) => (
            <span
              key={`measure-${zone.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone/15 bg-white px-3 py-1 text-xs font-medium text-charcoal"
            >
              <span className="w-2 h-2 rounded-full bg-white border border-stone/30" />
              {zone.code}
              <span className="text-stone">·</span>
              <span className="tabular-nums">{zone.zoneMm} mm</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
