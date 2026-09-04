import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { LabHeader } from '../../components/lab/LabHeader'
import { StepIndicator } from '../../components/lab/StepIndicator'
import { StreakBenchScene } from '../../components/lab/StreakBenchScene'
import { StreakObjectivePanel } from '../../components/lab/StreakObjectivePanel'
import { MentorPanel } from '../../components/lab/MentorPanel'
import { StreakInterpretQuiz } from '../../components/lab/StreakInterpretQuiz'
import { ExperimentCompleted } from '../../components/lab/ExperimentCompleted'
import { PlateView } from '../../components/lab/PlateView'
import {
  streakPlateExperiment,
  TICK_MS,
  STEP_ORDER,
  buildMentorContext,
} from '../../data/streakPlate'
import { INITIAL_STATE, labReducer } from '../../lib/streakPlateMachine'
import { useAuth } from '../../context/useAuth'
import { saveAttempt } from '../../lib/experimentAttempts'
import referenceText from '../../../docs/StreakIt_Streak_Plate_Mentor_Reference.md?raw'

const EXPERIMENT_NAME = streakPlateExperiment.title
const STEPS = streakPlateExperiment.steps

export function StreakPlateLab() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [state, dispatch] = useReducer(labReducer, INITIAL_STATE)
  const savedRef = useRef(false)

  const currentStepId = STEP_ORDER[state.stepIndex]

  const mentorPrompt = useMemo(
    () => ({
      referenceText,
      contextString: buildMentorContext(
        currentStepId,
        state.phase,
        state.activeRegion,
        state.regions,
        state.mistakes.length > 0
          ? state.mistakes[state.mistakes.length - 1]
          : null,
      ),
    }),
    [
      currentStepId,
      state.phase,
      state.activeRegion,
      state.regions,
      state.mistakes,
    ],
  )

  // Timer tick effect.
  useEffect(() => {
    if (!state.timerRunning) return

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [state.timerRunning])

  // Save attempt when finished.
  useEffect(() => {
    if (!state.finished || !state.score || savedRef.current) return

    savedRef.current = true

    if (user) {
      saveAttempt(user.id, {
        experimentName: EXPERIMENT_NAME,
        score: state.score.overall,
        proceduralAccuracy: state.score.procedural,
        decisionAccuracy: state.score.decision,
        interpretationAccuracy: state.score.interpretation,
        mode: state.mode,
      }).catch((error) => {
        console.error('Failed to save attempt:', error)
      })
    }
  }, [state.finished, state.score, state.mode, user])

  function handleReset() {
    savedRef.current = false
    dispatch({ type: 'RESET' })
  }

  if (state.finished && state.score) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <ExperimentCompleted
            score={state.score}
            visual={
              <PlateView
                regions={state.regions}
                outcome={state.streakingOutcome}
                grown
                size={160}
              />
            }
            experimentName={EXPERIMENT_NAME}
            mode={state.mode}
            onRetry={handleReset}
            onViewProgress={() => navigate('/progress')}
            onBackToExperiments={() => navigate('/experiments')}
          />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <LabHeader
          title={EXPERIMENT_NAME}
          mode={state.mode}
          canChangeMode={
            state.stepIndex === 0 && state.phase === 'select' && state.selected.size === 0
          }
          onModeChange={(mode) => dispatch({ type: 'SET_MODE', payload: mode })}
          onExit={() => navigate('/experiments')}
        />

        <StepIndicator steps={STEPS} activeStep={state.stepIndex} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {state.stepIndex === 4 ? (
              <div className="bg-surface rounded-card border border-stone/10 p-8">
                <StreakInterpretQuiz
                  resultAnswer={state.answers.result}
                  reasoningAnswer={state.answers.reasoning}
                  onAnswer={(field, value) =>
                    dispatch({ type: 'ANSWER', payload: { field, value } })
                  }
                  onSubmit={() => dispatch({ type: 'SUBMIT_INTERPRETATION' })}
                />
              </div>
            ) : (
              <StreakBenchScene
                step={currentStepId}
                phase={state.phase}
                selected={state.selected}
                regions={state.regions}
                activeRegion={state.activeRegion}
                loopFlamed={state.loopFlamed}
                loopHot={state.loopHot}
                coolMs={state.coolMs}
                pendingCarryover={state.pendingCarryover}
                activeMistake={state.activeMistake}
                plateViewOn={state.plateViewOn}
                streakingOutcome={state.streakingOutcome}
                onSelectItem={(id) => dispatch({ type: 'SELECT_ITEM', payload: id })}
                onFlameLoop={() => dispatch({ type: 'FLAME_LOOP' })}
                onSetCarryover={(technique) =>
                  dispatch({ type: 'SET_CARRYOVER', payload: technique })
                }
                onStreakRegion={() => dispatch({ type: 'STREAK_REGION' })}
                onTogglePlateView={() => dispatch({ type: 'TOGGLE_PLATE_VIEW' })}
              />
            )}

            <div className="hidden lg:block">
              <div className="flex items-center gap-3 bg-surface rounded-card border border-stone/10 px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
                  <span className="text-teal text-xs font-bold">
                    {state.mode === 'test' ? 'T' : 'L'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {state.mode === 'test' ? 'Test Mode' : 'Learn Mode'}
                  </p>
                  <p className="text-sm text-stone">
                    {state.mode === 'test'
                      ? 'No hints. Your score will be saved.'
                      : 'Use the AI mentor for guidance.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <StreakObjectivePanel
              step={currentStepId}
              phase={state.phase}
              mode={state.mode}
              timerMs={state.timerMs}
              coolMs={state.coolMs}
              loopHot={state.loopHot}
              loopFlamed={state.loopFlamed}
              activeRegion={state.activeRegion}
              pendingCarryover={state.pendingCarryover}
              activeMistake={state.activeMistake}
              onConfirmPrepare={() => dispatch({ type: 'CONFIRM_PREPARE' })}
              onFlameLoop={() => dispatch({ type: 'FLAME_LOOP' })}
              onSetCarryover={(technique) =>
                dispatch({ type: 'SET_CARRYOVER', payload: technique })
              }
              onStreakRegion={() => dispatch({ type: 'STREAK_REGION' })}
              onFinishStreak={() => dispatch({ type: 'FINISH_STREAK' })}
              onStartIncubation={() => dispatch({ type: 'START_INCUBATION' })}
              onStopIncubation={() => dispatch({ type: 'STOP_INCUBATION' })}
              onTogglePlateView={() => dispatch({ type: 'TOGGLE_PLATE_VIEW' })}
              onAdvance={() => dispatch({ type: 'ADVANCE' })}
              onDismissMistake={() => dispatch({ type: 'DISMISS_MISTAKE' })}
            />

            <MentorPanel
              mode={state.mode}
              prompt={mentorPrompt}
              greeting="I'm your AI Lab Mentor. Ask me anything about streak plate technique, aseptic handling, or colony isolation."
              fallbackHint="remember: flame the loop between regions and use light carryover"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
