import type { ObservedResult } from '../../data/gramStaining'

interface MicroscopeViewProps {
  result: ObservedResult
  size?: number
}

export function MicroscopeView({ result, size = 256 }: MicroscopeViewProps) {
  const baseColor = result === 'pink' ? '#E89AA6' : result === 'purple' ? '#8B5CF6' : '#E5E0D8'
  const cellColor = result === 'pink' ? '#D65A6E' : result === 'purple' ? '#6D28D9' : '#A8A29E'
  const label =
    result === 'purple'
      ? 'Purple / violet cells'
      : result === 'pink'
        ? 'Pink / red cells'
        : 'No sample observed'

  const viewBoxSize = 200
  const cellCount = 22

  return (
    <div className="flex flex-col items-center animate-iris-open">
      <div
        className="relative rounded-full border-[8px] border-charcoal/85 bg-charcoal shadow-2xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: baseColor }}
        />

        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="absolute inset-0 w-full h-full animate-field-settle"
          preserveAspectRatio="xMidYMid slice"
        >
          {[...Array(cellCount)].map((_, i) => {
            const x = 20 + ((i * 41) % 160)
            const y = 18 + ((i * 67) % 155)
            const rx = 7 + (i % 6)
            const ry = 3.5 + (i % 4)
            const rotation = (i * 53) % 180
            const opacity = 0.65 + ((i % 4) * 0.07)
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

          {[...Array(8)].map((_, i) => (
            <circle
              key={`dot-${i}`}
              cx={30 + ((i * 23) % 140)}
              cy={35 + ((i * 31) % 120)}
              r={0.8 + (i % 2) * 0.6}
              fill={cellColor}
              opacity={0.35}
            />
          ))}
        </svg>

        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,0.4)]" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_12px_rgba(255,255,255,0.12)]" />
      </div>

      <div
        className="mt-4 text-center"
        style={{ maxWidth: size }}
      >
        <p className="text-sm font-semibold text-charcoal">{label}</p>
      </div>
    </div>
  )
}
