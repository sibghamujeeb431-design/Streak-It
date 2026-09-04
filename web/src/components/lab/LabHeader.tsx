import { LogOut } from 'lucide-react'
import type { LabMode } from '../../data/labCommon'

interface LabHeaderProps {
  title: string
  mode: LabMode
  canChangeMode: boolean
  onModeChange: (mode: LabMode) => void
  onExit: () => void
}

export function LabHeader({
  title,
  mode,
  canChangeMode,
  onModeChange,
  onExit,
}: LabHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-charcoal">{title}</h1>

      <div className="flex items-center gap-4">
        <div
          className={`inline-flex bg-[#FDFBF7] rounded-button border border-stone/15 p-1 ${
            !canChangeMode ? 'opacity-70' : ''
          }`}
          title={
            canChangeMode ? undefined : 'Mode is locked after the experiment starts'
          }
        >
          <button
            type="button"
            onClick={() => onModeChange('learn')}
            disabled={!canChangeMode}
            className={`px-5 py-2 text-sm font-medium rounded-button transition-colors ${
              mode === 'learn'
                ? 'bg-coral text-white'
                : 'text-stone hover:text-charcoal'
            }`}
          >
            Learn
          </button>
          <button
            type="button"
            onClick={() => onModeChange('test')}
            disabled={!canChangeMode}
            className={`px-5 py-2 text-sm font-medium rounded-button transition-colors ${
              mode === 'test'
                ? 'bg-coral text-white'
                : 'text-stone hover:text-charcoal'
            }`}
          >
            Test
          </button>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-charcoal bg-[#FDFBF7] border border-stone/15 rounded-button hover:bg-stone/5 transition-colors"
        >
          Exit Lab
          <LogOut size={16} />
        </button>
      </div>
    </div>
  )
}
