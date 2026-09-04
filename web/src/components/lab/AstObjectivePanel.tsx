import type {
  InoculationTechnique,
  Mistake,
  Phase,
  StepId,
} from '../../data/ast'
import type { LabMode } from '../../data/labCommon'
import {
  INCUBATE_MS,
  MIN_DISCS,
  STEP_INFO,
  STEP_ORDER,
} from '../../data/ast'
import { TimerRing } from './TimerRing'
import { FeedbackBar } from './FeedbackBar'

interface AstObjectivePanelProps {
  step: StepId
  phase: Phase
  mode: LabMode
  timerMs: number
  technique: InoculationTechnique
  placedDiscCount: number
  plateViewOn: boolean
  activeMistake: Mistake | null
  onConfirmPrepare: () => void
  onSetTechnique: (technique: InoculationTechnique) => void
  onInoculate: () => void
  onFinishDiscs: () => void
  onStartIncubation: () => void
  onStopIncubation: () => void
  onTogglePlateView: () => void
  onAdvance: () => void
  onDismissMistake: () => void
}

export function AstObjectivePanel({
  step,
  phase,
  mode,
  timerMs,
  technique,
  placedDiscCount,
  plateViewOn,
  activeMistake,
  onConfirmPrepare,
  onSetTechnique,
  onInoculate,
  onFinishDiscs,
  onStartIncubation,
  onStopIncubation,
  onTogglePlateView,
  onAdvance,
  onDismissMistake,
}: AstObjectivePanelProps) {
  const info = STEP_INFO[step]

  function renderAction() {
    if (step === 'prepare') {
      const ready = phase === 'done'
      return (
        <button
          type="button"
          onClick={onConfirmPrepare}
          disabled={!ready}
          className="w-full bg-coral hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-button transition-colors"
        >
          {ready ? info.actionLabel : 'Select the 3 correct items'}
        </button>
      )
    }

    if (step === 'inoculate') {
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
        <div className="flex flex-col items-center gap-4">
          <TechniqueToggle value={technique} onChange={onSetTechnique} />
          <button
            type="button"
            onClick={onInoculate}
            className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
          >
            {info.actionLabel}
          </button>
        </div>
      )
    }

    if (step === 'discs') {
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
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-stone text-center">
            {placedDiscCount} of {MIN_DISCS} discs placed
          </p>
          <button
            type="button"
            onClick={onFinishDiscs}
            disabled={placedDiscCount < MIN_DISCS}
            className="w-full bg-coral hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-button transition-colors"
          >
            Finish Placing Discs
          </button>
        </div>
      )
    }

    if (step === 'incubate') {
      if (phase === 'incubating') {
        return (
          <div className="flex flex-col items-center gap-4">
            <TimerRing
              mode="countdown"
              valueMs={timerMs}
              maxMs={INCUBATE_MS}
              label="incubating"
            />
            {mode === 'test' ? (
              <button
                type="button"
                onClick={onStopIncubation}
                className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
              >
                Stop Incubation
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full bg-stone/20 text-stone font-medium py-3 rounded-button cursor-not-allowed"
              >
                Incubating...
              </button>
            )}
          </div>
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
        <button
          type="button"
          onClick={onStartIncubation}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          {info.actionLabel}
        </button>
      )
    }

    if (step === 'interpret') {
      if (!plateViewOn) {
        return (
          <button
            type="button"
            onClick={onTogglePlateView}
            className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
          >
            {info.actionLabel}
          </button>
        )
      }

      return (
        <div className="text-center py-3 text-sm text-stone">
          Answer both questions below, then submit your interpretation.
        </div>
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

function TechniqueToggle({
  value,
  onChange,
}: {
  value: InoculationTechnique
  onChange: (value: InoculationTechnique) => void
}) {
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-charcoal mb-2">Inoculation technique</p>
      <div className="flex rounded-button border border-stone/15 overflow-hidden">
        <button
          type="button"
          onClick={() => onChange('even-lawn')}
          className={`flex-1 py-2 px-2 text-xs font-medium transition-colors ${
            value === 'even-lawn'
              ? 'bg-coral text-white'
              : 'bg-white text-charcoal hover:bg-stone/5'
          }`}
        >
          Swab all directions
        </button>
        <button
          type="button"
          onClick={() => onChange('quick-swipe')}
          className={`flex-1 py-2 px-2 text-xs font-medium transition-colors ${
            value === 'quick-swipe'
              ? 'bg-coral text-white'
              : 'bg-white text-charcoal hover:bg-stone/5'
          }`}
        >
          Single quick swipe
        </button>
      </div>
    </div>
  )
}
