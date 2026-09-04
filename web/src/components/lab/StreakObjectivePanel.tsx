import type {
  CarryoverTechnique,
  Mistake,
  Phase,
  StepId,
} from '../../data/streakPlate'
import type { LabMode } from '../../data/labCommon'
import {
  LOOP_COOL_MS,
  INCUBATE_MS,
  REGION_COUNT,
  STEP_INFO,
  STEP_ORDER,
} from '../../data/streakPlate'
import { TimerRing } from './TimerRing'
import { FeedbackBar } from './FeedbackBar'

interface StreakObjectivePanelProps {
  step: StepId
  phase: Phase
  mode: LabMode
  timerMs: number
  coolMs: number
  loopHot: boolean
  loopFlamed: boolean
  activeRegion: number
  pendingCarryover: CarryoverTechnique
  activeMistake: Mistake | null
  onConfirmPrepare: () => void
  onFlameLoop: () => void
  onSetCarryover: (technique: CarryoverTechnique) => void
  onStreakRegion: () => void
  onFinishStreak: () => void
  onStartIncubation: () => void
  onStopIncubation: () => void
  onTogglePlateView: () => void
  onAdvance: () => void
  onDismissMistake: () => void
}

export function StreakObjectivePanel({
  step,
  phase,
  mode,
  timerMs,
  coolMs,
  loopHot,
  loopFlamed,
  activeRegion,
  pendingCarryover,
  activeMistake,
  onConfirmPrepare,
  onFlameLoop,
  onSetCarryover,
  onStreakRegion,
  onFinishStreak,
  onStartIncubation,
  onStopIncubation,
  onTogglePlateView,
  onAdvance,
  onDismissMistake,
}: StreakObjectivePanelProps) {
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

    if (step === 'streak') {
      if (phase === 'cooling') {
        return (
          <div className="flex flex-col items-center gap-4">
            <TimerRing
              mode="countdown"
              valueMs={coolMs}
              maxMs={LOOP_COOL_MS}
              label="cooling"
            />
            <button
              type="button"
              disabled
              className="w-full bg-stone/20 text-stone font-medium py-3 rounded-button cursor-not-allowed"
            >
              Cooling loop...
            </button>
            <CarryoverToggle
              value={pendingCarryover}
              onChange={onSetCarryover}
              disabled
            />
            <button
              type="button"
              disabled
              className="w-full bg-stone/20 text-stone font-medium py-3 rounded-button cursor-not-allowed"
            >
              Wait for loop to cool
            </button>
          </div>
        )
      }

      if (phase === 'done') {
        return (
          <button
            type="button"
            onClick={onFinishStreak}
            className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
          >
            Finish Streaking
          </button>
        )
      }

      const regionNumber = activeRegion + 1
      const canStreak = !loopHot && (activeRegion === 0 || loopFlamed)
      const needsFlame = activeRegion > 0 && !loopFlamed

      return (
        <div className="flex flex-col items-center gap-4">
          {loopHot ? (
            <TimerRing
              mode="countdown"
              valueMs={coolMs}
              maxMs={LOOP_COOL_MS}
              label="cooling"
            />
          ) : (
            <div className="flex items-center justify-center h-28">
              <p className="text-sm text-stone text-center">
                {needsFlame
                  ? 'Flame the loop before the next region.'
                  : 'Loop is cool and ready.'}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onFlameLoop}
            disabled={loopHot}
            className="w-full bg-teal hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-button transition-colors"
          >
            Flame Loop
          </button>

          <CarryoverToggle
            value={pendingCarryover}
            onChange={onSetCarryover}
            disabled={loopHot}
          />

          <button
            type="button"
            onClick={onStreakRegion}
            disabled={!canStreak}
            className="w-full bg-coral hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-button transition-colors"
          >
            {activeRegion >= REGION_COUNT
              ? 'Streaking complete'
              : `Streak Region ${regionNumber}`}
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

    if (step === 'observe' && phase === 'observe') {
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

function CarryoverToggle({
  value,
  onChange,
  disabled,
}: {
  value: CarryoverTechnique
  onChange: (value: CarryoverTechnique) => void
  disabled?: boolean
}) {
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-charcoal mb-2">Carryover technique</p>
      <div className="flex rounded-button border border-stone/15 overflow-hidden">
        <button
          type="button"
          onClick={() => onChange('light')}
          disabled={disabled}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            value === 'light'
              ? 'bg-coral text-white'
              : 'bg-white text-charcoal hover:bg-stone/5'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => onChange('heavy')}
          disabled={disabled}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            value === 'heavy'
              ? 'bg-coral text-white'
              : 'bg-white text-charcoal hover:bg-stone/5'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Heavy
        </button>
      </div>
    </div>
  )
}
