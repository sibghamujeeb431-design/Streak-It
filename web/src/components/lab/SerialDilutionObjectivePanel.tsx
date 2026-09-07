import { TimerRing } from './TimerRing'
import { FeedbackBar } from './FeedbackBar'
import type { Phase, StepId } from '../../data/serialDilution'
import { DILUTION_TUBES, STEP_INFO, STEP_ORDER } from '../../data/serialDilution'
import type { Mistake } from '../../data/serialDilution'
import type { LabMode } from '../../data/labCommon'

interface SerialDilutionObjectivePanelProps {
  step: StepId
  phase: Phase
  mode: LabMode
  timerMs: number
  currentDilutionIndex: number
  plateViewOn: boolean
  activeMistake: Mistake | null
  onConfirmPrepare: () => void
  onStartTransfer: () => void
  onCompleteTransfer: () => void
  onSkipMixing: () => void
  onCompleteMixing: () => void
  onPourPlate: () => void
  onStartIncubation: () => void
  onStopIncubation: () => void
  onTogglePlateView: () => void
  onAdvance: () => void
  onDismissMistake: () => void
}

export function SerialDilutionObjectivePanel({
  step,
  phase,
  mode,
  timerMs,
  currentDilutionIndex,
  plateViewOn,
  activeMistake,
  onConfirmPrepare,
  onStartTransfer,
  onCompleteTransfer,
  onSkipMixing,
  onCompleteMixing,
  onPourPlate,
  onStartIncubation,
  onStopIncubation,
  onTogglePlateView,
  onAdvance,
  onDismissMistake,
}: SerialDilutionObjectivePanelProps) {
  const stepInfo = STEP_INFO[step]

  function renderAction() {
    if (step === 'prepare' && phase === 'done') {
      return (
        <button
          type="button"
          onClick={onConfirmPrepare}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Continue to Dilution
        </button>
      )
    }

    if (step === 'dilute' && phase === 'select') {
      return (
        <button
          type="button"
          onClick={onStartTransfer}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Start Transfer
        </button>
      )
    }

    if (step === 'dilute' && phase === 'transferring') {
      return (
        <button
          type="button"
          onClick={onCompleteTransfer}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Complete Transfer
        </button>
      )
    }

    if (step === 'dilute' && phase === 'mixing') {
      return (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onCompleteMixing}
            className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
          >
            Complete Mixing
          </button>
          <button
            type="button"
            onClick={onSkipMixing}
            className="w-full bg-stone hover:bg-stone/90 text-white font-medium py-3 rounded-button transition-colors"
          >
            Skip Mixing
          </button>
        </div>
      )
    }

    if (step === 'dilute' && phase === 'done') {
      return (
        <button
          type="button"
          onClick={onAdvance}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Continue to Pour Plate
        </button>
      )
    }

    if (step === 'pour-plate' && phase === 'done') {
      return (
        <button
          type="button"
          onClick={onPourPlate}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Pour Selected Dilution and Continue
        </button>
      )
    }

    if (step === 'incubate' && phase === 'select') {
      return (
        <button
          type="button"
          onClick={onStartIncubation}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Submit for Incubation
        </button>
      )
    }

    if (step === 'incubate' && phase === 'incubating') {
      return (
        <div className="flex flex-col items-center gap-4">
          <TimerRing mode="countdown" valueMs={timerMs} maxMs={3000} size={80} />
          {mode === 'test' && (
            <button
              type="button"
              onClick={onStopIncubation}
              className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
            >
              Stop Incubation
            </button>
          )}
        </div>
      )
    }

    if (step === 'incubate' && phase === 'done') {
      return (
        <button
          type="button"
          onClick={onAdvance}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Continue to Interpret
        </button>
      )
    }

    if (step === 'interpret' && phase === 'done') {
      return (
        <button
          type="button"
          onClick={onAdvance}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Submit Interpretation
        </button>
      )
    }

    return (
      <div className="text-center py-3 text-sm text-stone">
        Follow the instructions above to complete this step.
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-card border border-stone/10 p-6">
      <p className="text-sm font-medium text-charcoal mb-1">Current Objective</p>
      <p className="text-sm font-semibold text-coral mb-4">
        Step {STEP_ORDER.indexOf(step) + 1} of {STEP_ORDER.length}
      </p>

      <h3 className="text-lg font-semibold text-charcoal mb-2">{stepInfo.objective}</h3>
      <p className="text-sm text-stone mb-6">{stepInfo.instruction}</p>

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

      <p className="text-xs text-stone/70">{stepInfo.helperText}</p>

      {step === 'dilute' && (
        <div className="mt-6 bg-white rounded-card border border-stone/10 p-4">
          <h4 className="text-sm font-semibold text-charcoal mb-3">Dilution Progress</h4>
          <div className="flex gap-2">
            {DILUTION_TUBES.map((tube, index) => (
              <div
                key={tube}
                className={`flex-1 p-2 rounded text-center text-xs ${
                  index < currentDilutionIndex
                    ? 'bg-teal/10 text-teal'
                    : index === currentDilutionIndex
                    ? 'bg-coral/10 text-coral'
                    : 'bg-stone/5 text-stone'
                }`}
              >
                {tube}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'interpret' && !plateViewOn && (
        <button
          onClick={onTogglePlateView}
          className="w-full mt-4 px-4 py-3 bg-teal hover:bg-teal/90 text-white rounded-button transition-colors"
        >
          Switch to Plate View
        </button>
      )}
    </div>
  )
}
