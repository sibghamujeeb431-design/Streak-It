import type {
  DecolorizeStage,
  Phase,
  StepId,
  Mistake,
} from '../../data/gramStaining'
import type { LabMode } from '../../data/labCommon'
import {
  DECOLORIZE_MAX_MS,
  DECOLORIZE_OVER_MS,
  DECOLORIZE_UNDER_MS,
  STAIN_DURATION_MS,
  STEP_INFO,
  STEP_ORDER,
} from '../../data/gramStaining'
import { TimerRing } from './TimerRing'
import { FeedbackBar } from './FeedbackBar'

interface ObjectivePanelProps {
  step: StepId
  phase: Phase
  mode: LabMode
  timerMs: number
  decolorizeElapsedMs: number
  decolorizeStage: DecolorizeStage
  activeMistake: Mistake | null
  onSelectSlide: () => void
  onRinse: () => void
  onApplyDone: () => void
  onStopDecolorize: () => void
  onToggleMicroscope: () => void
  onAdvance: () => void
  onDismissMistake: () => void
}

export function ObjectivePanel({
  step,
  phase,
  mode,
  timerMs,
  decolorizeElapsedMs,
  activeMistake,
  onSelectSlide,
  onRinse,
  onApplyDone,
  onStopDecolorize,
  onToggleMicroscope,
  onAdvance,
  onDismissMistake,
}: ObjectivePanelProps) {
  const info = STEP_INFO[step]

  function renderAction() {
    if (step === 'prepare' && phase === 'select') {
      return (
        <button
          type="button"
          onClick={onSelectSlide}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          {info.actionLabel}
        </button>
      )
    }

    if (phase === 'apply') {
      return (
        <div className="flex flex-col items-center gap-4">
          <TimerRing
            mode="countdown"
            valueMs={timerMs}
            maxMs={STAIN_DURATION_MS}
          />
          {mode === 'test' ? (
            <button
              type="button"
              onClick={onApplyDone}
              className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
            >
              Stop Staining
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full bg-stone/20 text-stone font-medium py-3 rounded-button cursor-not-allowed"
            >
              Processing...
            </button>
          )}
        </div>
      )
    }

    if (phase === 'rinse') {
      return (
        <button
          type="button"
          onClick={onRinse}
          className="w-full bg-teal hover:bg-teal/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Rinse Slide
        </button>
      )
    }

    if (phase === 'decolorize') {
      return (
        <div className="flex flex-col items-center gap-4">
          <TimerRing
            mode="countup"
            valueMs={decolorizeElapsedMs}
            maxMs={DECOLORIZE_MAX_MS}
            windowStartMs={DECOLORIZE_UNDER_MS}
            windowEndMs={DECOLORIZE_OVER_MS}
            label="decolorize"
          />
          <button
            type="button"
            onClick={onStopDecolorize}
            className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
          >
            Stop Decolorizer
          </button>
        </div>
      )
    }

    if (step === 'observe' && phase === 'select') {
      return (
        <button
          type="button"
          onClick={onToggleMicroscope}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          {info.actionLabel}
        </button>
      )
    }

    if (phase === 'done') {
      return (
        <button
          type="button"
          onClick={onAdvance}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Continue
        </button>
      )
    }

    return (
      <div className="text-center py-3 text-sm text-stone">
        Use the workspace to interact with the lab bench.
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-card border border-stone/10 p-6">
      <p className="text-sm font-medium text-charcoal mb-1">Current Objective</p>
      <p className="text-sm font-semibold text-coral mb-4">
        Step {STEP_ORDER.indexOf(step) + 1} of {STEP_ORDER.length}
      </p>

      <h3 className="text-lg font-semibold text-charcoal mb-2">{info.objective}</h3>
      <p className="text-sm text-stone mb-6">{info.instruction}</p>

      {activeMistake && (
        <div className="mb-4">
          <FeedbackBar message={activeMistake.message} type="error" />
          <button
            type="button"
            onClick={onDismissMistake}
            className="mt-3 w-full text-sm text-coral font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-6">{renderAction()}</div>

      <p className="text-xs text-stone/70">{info.helperText}</p>
    </div>
  )
}
