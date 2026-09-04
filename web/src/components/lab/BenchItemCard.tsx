import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import type { BenchItem } from '../../data/labCommon'

interface BenchItemCardProps {
  item: BenchItem
  selected: boolean
  disabled?: boolean
  onClick?: () => void
}

export function BenchItemCard({
  item,
  selected,
  disabled = false,
  onClick,
}: BenchItemCardProps) {
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!pressed) return
    const id = window.setTimeout(() => setPressed(false), 420)
    return () => window.clearTimeout(id)
  }, [pressed])

  const handleClick = () => {
    if (disabled || selected) return
    setPressed(true)
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center gap-2 rounded-card p-3 transition-all duration-200 ${
        selected
          ? 'bg-coral-50 ring-2 ring-coral ring-offset-2 ring-offset-bench shadow-[0_0_0_6px_rgba(201,106,69,0.10)]'
          : 'bg-transparent hover:-translate-y-1 hover:drop-shadow-md'
      } ${disabled ? 'opacity-45 cursor-not-allowed saturate-50' : 'cursor-pointer'}`}
      aria-pressed={selected}
      aria-label={item.name}
    >
      <div className={`relative w-20 h-20 ${pressed ? 'animate-bottle-press' : ''}`}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain drop-shadow-sm"
        />
        {selected && (
          <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full bg-coral text-white flex items-center justify-center">
            <Check size={14} strokeWidth={3} />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-charcoal">{item.name}</p>
        <p className="text-[11px] text-stone">
          {item.kind === 'sample'
            ? 'Sample'
            : item.kind === 'plate'
              ? 'Growth medium'
              : 'Streaking tool'}
        </p>
      </div>
    </button>
  )
}
