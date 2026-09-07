import { useMemo } from 'react'

interface MicroscopePanelProps {
  color?: string | null
  caption?: string | null
  size?: number
  visible?: boolean
}

export function MicroscopePanel({ color, caption, size = 128, visible = true }: MicroscopePanelProps) {
  if (!visible) return null

  const hasSample = Boolean(color)

  const cellColor = useMemo(() => {
    if (!color) return '#B8B2A8'
    return color
  }, [color])

  const viewBoxSize = 160
  const cellCount = 14

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1.5 pointer-events-none select-none"
      style={{ width: size }}
    >
      <div
        className="relative rounded-full border-[6px] border-charcoal/85 bg-charcoal shadow-xl overflow-hidden transition-all duration-500"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: hasSample ? `${cellColor}33` : '#EDEAE4' }}
        />

        {hasSample ? (
          <svg
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            className="absolute inset-0 w-full h-full animate-field-settle"
            preserveAspectRatio="xMidYMid slice"
          >
            {[...Array(cellCount)].map((_, i) => {
              const x = 16 + ((i * 33) % 128)
              const y = 14 + ((i * 53) % 124)
              const rx = 5 + (i % 5)
              const ry = 2.5 + (i % 3)
              const rotation = (i * 61) % 180
              const opacity = 0.55 + ((i % 4) * 0.08)
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx={rx}
                  ry={ry}
                  fill={cellColor}
                  opacity={opacity}
                  transform={`rotate(${rotation} ${x} ${y})`}
                />
              )
            })}
          </svg>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-medium text-stone/60 text-center px-3">
              No sample
            </span>
          </div>
        )}

        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_rgba(255,255,255,0.12)]" />

        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
      </div>

      {caption && (
        <p className="text-[10px] font-medium text-charcoal/70 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full shadow-sm max-w-[140px] text-center leading-tight">
          {caption}
        </p>
      )}
    </div>
  )
}