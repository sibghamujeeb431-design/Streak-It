import { useEffect, useState } from 'react'
import type { Reagent } from '../../data/gramStaining'

interface ReagentBottleProps {
  reagent: Reagent
  disabled?: boolean
  highlighted?: boolean
  active?: boolean
  onClick?: () => void
}

export function ReagentBottle({
  reagent,
  disabled = false,
  highlighted = false,
  active = false,
  onClick,
}: ReagentBottleProps) {
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!pressed) return
    const id = window.setTimeout(() => setPressed(false), 420)
    return () => window.clearTimeout(id)
  }, [pressed])

  const handleClick = () => {
    if (disabled) return
    setPressed(true)
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center gap-2 rounded-card p-3 transition-all duration-200 ${
        highlighted && !disabled
          ? 'bg-coral-50/60 ring-2 ring-coral ring-offset-2 ring-offset-bench shadow-[0_0_0_6px_rgba(201,106,69,0.10)]'
          : 'bg-transparent hover:-translate-y-1 hover:drop-shadow-md'
      } ${disabled ? 'opacity-45 cursor-not-allowed saturate-50' : 'cursor-pointer'}`}
      aria-pressed={highlighted}
      aria-label={reagent.name}
    >
      <div className={`relative w-16 h-24 ${pressed ? 'animate-bottle-press' : ''}`}>
        <img
          src={`/images/lab/gram-staining/bottle-${reagent.id}.png`}
          alt={reagent.name}
          className="w-full h-full object-contain drop-shadow-sm"
        />
        {active && (
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-bottle-drip"
            style={{ backgroundColor: reagent.liquidColor }}
          />
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-charcoal">{reagent.shortName}</p>
        <p className="text-[11px] text-stone">{reagent.role}</p>
      </div>
    </button>
  )
}
