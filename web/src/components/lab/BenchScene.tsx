import { useMemo } from 'react'
import { Microscope } from 'lucide-react'
import type {
  DecolorizeStage,
  Mistake,
  ObservedResult,
  Phase,
  ReagentId,
  StepId,
} from '../../data/gramStaining'
import type { LabMode } from '../../data/labCommon'
import { REAGENTS } from '../../data/gramStaining'
import { BenchSurface } from './BenchSurface'
import { MicroscopeView } from './MicroscopeView'
import { MicroscopePanel } from './MicroscopePanel'
import { ReagentBottle } from './ReagentBottle'

interface BenchSceneProps {
  step: StepId
  phase: Phase
  mode: LabMode
  decolorizeStage: DecolorizeStage
  activeMistake: Mistake | null
  microscopeOn: boolean
  observedResult: ObservedResult
  onPickReagent: (id: ReagentId) => void
  onToggleMicroscope: () => void
}

export function BenchScene({
  step,
  phase,
  mode,
  decolorizeStage,
  activeMistake,
  microscopeOn,
  observedResult,
  onPickReagent,
  onToggleMicroscope,
}: BenchSceneProps) {
  const smearColor = useMemo(() => {
    if (step === 'prepare') return '#E9E4DB'
    if (step === 'stain') {
      return phase === 'select' ? '#E9E4DB' : '#5B21B6'
    }
    if (step === 'decolorize') {
      if (decolorizeStage === null) return '#5B21B6'
      if (decolorizeStage === 'iodine') return '#3B1A78'
      return '#8A7FB0'
    }
    if (step === 'counterstain') {
      return phase === 'select' ? '#8A7FB0' : '#B4344A'
    }
    return observedResult === 'pink'
      ? '#C0455A'
      : observedResult === 'purple'
        ? '#5B21B6'
        : '#8A7FB0'
  }, [step, phase, decolorizeStage, observedResult])

  const activeReagentId = useMemo<ReagentId | null>(() => {
    if (phase === 'apply' || phase === 'decolorize') {
      if (step === 'stain') return 'crystal-violet'
      if (step === 'counterstain') return 'safranin'
      if (step === 'decolorize') {
        return decolorizeStage === 'decolorizer' ? 'decolorizer' : 'iodine'
      }
    }
    return null
  }, [phase, step, decolorizeStage])

  const microscopeCaption = useMemo(() => {
    if (step === 'prepare') return null
    if (step === 'stain') return phase === 'select' ? 'Awaiting crystal violet' : 'Crystal violet applied'
    if (step === 'decolorize') {
      if (decolorizeStage === null) return 'Iodine mordant applied'
      if (decolorizeStage === 'iodine') return 'Decolorizing...'
      return 'Decolorized'
    }
    if (step === 'counterstain') return phase === 'select' ? 'Awaiting safranin' : 'Safranin applied'
    if (step === 'observe' || step === 'interpret') return 'Final stained slide'
    return null
  }, [step, phase, decolorizeStage])

  const showAllReagents = step === 'stain' || step === 'counterstain'
  const isDecolorizeIodine = step === 'decolorize' && decolorizeStage === null
  const isDecolorizeDecolorizer = step === 'decolorize' && decolorizeStage === 'iodine'

  const availableReagents = showAllReagents
    ? REAGENTS
    : isDecolorizeIodine
      ? REAGENTS.filter((r) => r.id === 'iodine')
      : isDecolorizeDecolorizer
        ? REAGENTS.filter((r) => r.id === 'decolorizer')
        : []

  const statusText =
    phase === 'apply'
      ? 'Reagent applied — processing on the slide...'
      : phase === 'rinse'
        ? 'Processing complete. Rinse the slide to continue.'
        : phase === 'decolorize'
          ? 'Decolorizer is running. Watch the timer and stop it in the 2–5 second window.'
          : step === 'prepare'
            ? 'Select a prepared slide to begin the protocol.'
            : step === 'observe'
              ? 'Examine the slide under the microscope.'
              : step === 'interpret'
                ? 'Record your interpretation in the panel on the right.'
                : 'Choose the correct reagent for this step.'

  return (
    <div
      key={activeMistake?.timestamp ?? 'ok'}
      className={`rounded-card ${activeMistake ? 'animate-error-shake' : ''}`}
    >
      <BenchSurface
        photoSrc="/images/lab/scenes/gram-staining-scene.png"
        className="min-h-[520px] flex flex-col overflow-hidden"
      >
        {activeMistake && (
          <div className="absolute inset-0 bg-coral/[0.04] pointer-events-none z-20" />
        )}

        <div className="flex-1 relative px-6 py-8 lg:px-10 lg:py-10">
          {step === 'observe' && microscopeOn ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center animate-iris-open">
              <MicroscopeView result={observedResult} />
            </div>
          ) : null}

          <div className="relative z-10 h-full flex flex-col items-center justify-center gap-6">
            <div className="flex items-end justify-center gap-2 sm:gap-3">
              {REAGENTS.map((reagent) => {
                const isAvailable = availableReagents.some((r) => r.id === reagent.id)
                return (
                  <ReagentBottle
                    key={reagent.id}
                    reagent={reagent}
                    disabled={
                      !isAvailable || activeMistake !== null || phase !== 'select'
                    }
                    highlighted={mode === 'learn' && activeReagentId === reagent.id}
                    active={activeReagentId === reagent.id}
                    onClick={() => onPickReagent(reagent.id)}
                  />
                )
              })}
            </div>
          </div>

          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-5 z-20 rounded-full bg-white/85 backdrop-blur px-5 py-2.5 text-xs font-medium shadow-sm animate-fade-rise ${
              phase === 'decolorize' ? 'text-coral' : 'text-teal'
            }`}
          >
            {statusText}
          </div>
        </div>

        <div className="relative z-10 border-t border-stone/10 px-6 py-4 flex justify-center bg-white/40">
          <button
            type="button"
            onClick={onToggleMicroscope}
            disabled={step !== 'observe'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-button border border-stone/20 bg-white text-sm font-medium text-charcoal shadow-sm transition-all hover:bg-stone/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <Microscope size={18} className="text-coral" />
            Switch to Microscope View
          </button>
        </div>
      </BenchSurface>

      {step !== 'prepare' && !(step === 'observe' && microscopeOn) && (
        <MicroscopePanel color={smearColor} caption={microscopeCaption} />
      )}
    </div>
  )
}
