import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { LabHeader } from '../../components/lab/LabHeader'
import { StepIndicator } from '../../components/lab/StepIndicator'
import { BiochemicalTestingBenchScene } from '../../components/lab/BiochemicalTestingBenchScene'
import { BiochemicalTestingObjectivePanel } from '../../components/lab/BiochemicalTestingObjectivePanel'
import { MentorPanel } from '../../components/lab/MentorPanel'
import { BiochemicalTestingInterpretQuiz } from '../../components/lab/BiochemicalTestingInterpretQuiz'
import { ExperimentCompleted } from '../../components/lab/ExperimentCompleted'
import { MicroscopePanel } from '../../components/lab/MicroscopePanel'
import {
  biochemicalTestingExperiment,
  TICK_MS,
  STEP_ORDER,
  buildMentorContext,
} from '../../data/biochemicalTesting'
import { INITIAL_STATE, labReducer } from '../../lib/biochemicalTestingMachine'
import { useAuth } from '../../context/useAuth'
import { saveAttempt } from '../../lib/experimentAttempts'
import referenceText from '../../../docs/StreakIt_AI_Lab_Mentor_Reference.md?raw'

const EXPERIMENT_NAME = biochemicalTestingExperiment.title
const STEPS = biochemicalTestingExperiment.steps

export function BiochemicalTestingLab() {
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
        state.inoculationQuality,
        state.observedReactions.map((r) => r.tubeId),
        state.mistakes.length > 0
          ? state.mistakes[state.mistakes.length - 1]
          : null,
      ),
    }),
    [
      currentStepId,
      state.phase,
      state.inoculationQuality,
      state.observedReactions,
      state.mistakes,
    ],
  )

  // Observation window state
  const observationColor = useMemo(() => {
    if (currentStepId === 'prepare') return '#E9E4DB'
    if (currentStepId === 'inoculate') {
      const inoculatedCount = state.inoculatedTubes.length
      if (inoculatedCount === 0) return '#A89B8C'
      if (inoculatedCount === 1) return '#B88B6C'
      if (inoculatedCount === 2) return '#C99E7C'
      if (inoculatedCount === 3) return '#C99E7C'
      if (inoculatedCount === 4) return '#C99E7C'
      return '#C99E7C'
    }
    if (currentStepId === 'incubate') return '#B88B6C'
    if (currentStepId === 'observe') {
      const observedCount = state.observedReactions.length
      if (observedCount === 0) return '#C99E7C'
      if (observedCount === 1) return '#C99E7C'
      if (observedCount === 2) return '#C99E7C'
      if (observedCount === 3) return '#C99E7C'
      if (observedCount === 4) return '#C99E7C'
      return '#C99E7C'
    }
    if (currentStepId === 'interpret') return '#C99E7C'
    return '#E9E4DB'
  }, [currentStepId, state.inoculatedTubes, state.observedReactions, state.phase])

  const observationCaption = useMemo(() => {
    if (currentStepId === 'prepare') return 'Preparing culture'
    if (currentStepId === 'inoculate') {
      const inoculatedCount = state.inoculatedTubes.length
      if (inoculatedCount === 0) return 'Inoculate test tubes'
      return `${inoculatedCount} tube${inoculatedCount > 1 ? 's' : ''} inoculated`
    }
    if (currentStepId === 'incubate') return 'Reaction developing'
    if (currentStepId === 'observe') {
      const observedCount = state.observedReactions.length
      if (observedCount === 0) return 'Observe reactions'
      return `${observedCount} reaction${observedCount > 1 ? 's' : ''} observed`
    }
    if (currentStepId === 'interpret') return 'Final reaction'
    return 'Preparing culture'
  }, [currentStepId, state.inoculatedTubes, state.observedReactions, state.phase])

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
              <div className="flex items-center justify-center gap-4 p-6 bg-white rounded-card border border-stone/10">
                <div className="text-center">
                  <p className="text-sm font-semibold text-charcoal mb-2">Biochemical Profile</p>
                  <div className="flex gap-2">
                    {state.observedReactions.map((reaction) => (
                      <div
                        key={reaction.tubeId}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          reaction.result === 'positive'
                            ? 'bg-coral text-white'
                            : reaction.result === 'negative'
                            ? 'bg-teal text-white'
                            : 'bg-stone text-white'
                        }`}
                      >
                        {reaction.tubeId.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                <BiochemicalTestingInterpretQuiz
                  organismAnswer={state.answers.organism}
                  misconceptionAnswer={state.answers.misconception}
                  observedReactions={state.observedReactions}
                  onAnswer={(field, value) =>
                    dispatch({ type: 'ANSWER', payload: { field, value } })
                  }
                  onSubmit={() => dispatch({ type: 'SUBMIT_INTERPRETATION' })}
                />
              </div>
            ) : (
              <BiochemicalTestingBenchScene
                step={currentStepId}
                phase={state.phase}
                selected={state.selected}
                inoculationQuality={state.inoculationQuality}
                inoculatedTubes={state.inoculatedTubes}
                observedReactions={state.observedReactions}
                activeMistake={state.activeMistake}
                onSelectItem={(id) => dispatch({ type: 'SELECT_ITEM', payload: id })}
                onInoculateTube={(tubeId) =>
                  dispatch({ type: 'INOCULATE_TUBE', payload: tubeId })
                }
                onObserveTube={(tubeId) =>
                  dispatch({ type: 'OBSERVE_TUBE', payload: tubeId })
                }
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
            <BiochemicalTestingObjectivePanel
              step={currentStepId}
              phase={state.phase}
              mode={state.mode}
              timerMs={state.timerMs}
              inoculationQuality={state.inoculationQuality}
              inoculatedTubes={state.inoculatedTubes}
              observedReactions={state.observedReactions.map((r) => r.tubeId)}
              activeMistake={state.activeMistake}
              onConfirmPrepare={() => dispatch({ type: 'CONFIRM_PREPARE' })}
              onFinishInoculation={() => dispatch({ type: 'FINISH_INOCULATION' })}
              onStartIncubation={() => dispatch({ type: 'START_INCUBATION' })}
              onStopIncubation={() => dispatch({ type: 'STOP_INCUBATION' })}
              onFinishObservation={() => dispatch({ type: 'FINISH_OBSERVATION' })}
              onAdvance={() => dispatch({ type: 'ADVANCE' })}
              onDismissMistake={() => dispatch({ type: 'DISMISS_MISTAKE' })}
            />

            <MentorPanel
              mode={state.mode}
              prompt={mentorPrompt}
              greeting="I'm your AI Lab Mentor. Ask me anything about biochemical testing, enzyme reactions, or organism identification."
              fallbackHint="remember: identification is based on the full pattern of test results, not any single test"
            />
          </div>
        </div>
      </div>

      <MicroscopePanel color={observationColor} caption={observationCaption} />
    </DashboardLayout>
  )
}
