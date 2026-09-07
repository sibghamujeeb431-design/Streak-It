import { TimerRing } from './TimerRing'
import { FeedbackBar } from './FeedbackBar'
import type { Phase, StepId } from '../../data/biochemicalTesting'
import { STEP_INFO, STEP_ORDER, TEST_TUBES } from '../../data/biochemicalTesting'
import type { Mistake } from '../../data/biochemicalTesting'
import type { LabMode } from '../../data/labCommon'

interface BiochemicalTestingObjectivePanelProps {
  step: StepId
  phase: Phase
  mode: LabMode
  timerMs: number
  inoculationQuality: 'correct' | 'incomplete' | null
  inoculatedTubes: string[]
  observedReactions: string[]
  activeMistake: Mistake | null
  onConfirmPrepare: () => void
  onFinishInoculation: () => void
  onStartIncubation: () => void
  onStopIncubation: () => void
  onFinishObservation: () => void
  onAdvance: () => void
  onDismissMistake: () => void
}

export function BiochemicalTestingObjectivePanel({
  step,
  phase,
  mode,
  timerMs,
  inoculationQuality,
  inoculatedTubes,
  observedReactions,
  activeMistake,
  onConfirmPrepare,
  onFinishInoculation,
  onStartIncubation,
  onStopIncubation,
  onFinishObservation,
  onAdvance,
  onDismissMistake,
}: BiochemicalTestingObjectivePanelProps) {
  const stepInfo = STEP_INFO[step]

  function renderAction() {
    if (step === 'prepare' && phase === 'done') {
      return (
        <button
          type="button"
          onClick={onConfirmPrepare}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Confirm Selection
        </button>
      )
    }

    if (step === 'inoculate' && phase === 'select') {
      if (inoculatedTubes.length === 5) {
        return (
          <button
            type="button"
            onClick={onFinishInoculation}
            className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
          >
            Finish Inoculation
          </button>
        )
      }
      return (
        <div className="text-center py-3 text-sm text-stone">
          Click each test tube to inoculate ({inoculatedTubes.length}/5)
        </div>
      )
    }

    if (step === 'inoculate' && phase === 'done') {
      return (
        <button
          type="button"
          onClick={onAdvance}
          className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
        >
          Continue to Incubate
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
          Continue to Observe
        </button>
      )
    }

    if (step === 'observe' && phase === 'observing') {
      if (observedReactions.length === 5) {
        return (
          <button
            type="button"
            onClick={onFinishObservation}
            className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
          >
            Record All Observations
          </button>
        )
      }
      return (
        <div className="text-center py-3 text-sm text-stone">
          Click each test tube to observe reaction ({observedReactions.length}/5)
        </div>
      )
    }

    if (step === 'observe' && phase === 'done') {
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

      {step === 'inoculate' && (
        <div className="mt-6 bg-white rounded-card border border-stone/10 p-4">
          <h4 className="text-sm font-semibold text-charcoal mb-3">Inoculation Progress</h4>
          <div className="flex gap-2">
            {TEST_TUBES.map((tube, index) => (
              <div
                key={tube}
                className={`flex-1 p-2 rounded text-center text-xs ${
                  inoculatedTubes.includes(tube)
                    ? 'bg-teal/10 text-teal'
                    : 'bg-stone/5 text-stone'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          {inoculationQuality && (
            <div className={`mt-3 p-2 rounded text-xs text-center ${
              inoculationQuality === 'correct' ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'
            }`}>
              {inoculationQuality === 'correct' ? '✓ Complete' : '⚠️ Incomplete'}
            </div>
          )}
        </div>
      )}

      {step === 'observe' && (
        <div className="mt-6 bg-white rounded-card border border-stone/10 p-4">
          <h4 className="text-sm font-semibold text-charcoal mb-3">Observation Progress</h4>
          <div className="flex gap-2">
            {TEST_TUBES.map((tube, index) => (
              <div
                key={tube}
                className={`flex-1 p-2 rounded text-center text-xs ${
                  observedReactions.includes(tube)
                    ? 'bg-teal/10 text-teal'
                    : 'bg-stone/5 text-stone'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
