import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { LabHeader } from '../../components/lab/LabHeader'
import { StepIndicator } from '../../components/lab/StepIndicator'
import { BenchScene } from '../../components/lab/BenchScene'
import { ObjectivePanel } from '../../components/lab/ObjectivePanel'
import { MentorPanel } from '../../components/lab/MentorPanel'
import { InterpretQuiz } from '../../components/lab/InterpretQuiz'
import { ExperimentCompleted } from '../../components/lab/ExperimentCompleted'
import { MicroscopeView } from '../../components/lab/MicroscopeView'
import {
  gramStainingExperiment,
  TICK_MS,
  STEP_ORDER,
  buildMentorContext,
} from '../../data/gramStaining'
import { INITIAL_STATE, labReducer } from '../../lib/gramStainingMachine'
import { useAuth } from '../../context/useAuth'
import { saveAttempt } from '../../lib/experimentAttempts'
import referenceText from '../../../docs/StreakIt_AI_Lab_Mentor_Reference.md?raw'

const EXPERIMENT_NAME = gramStainingExperiment.title
const STEPS = gramStainingExperiment.steps

export function GramStainingLab() {
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
        state.mistakes.length > 0
          ? state.mistakes[state.mistakes.length - 1]
          : null,
        state.trueGramType,
      ),
    }),
    [currentStepId, state.phase, state.mistakes, state.trueGramType],
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
            visual={<MicroscopeView result={state.observedResult} size={160} />}
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
            state.stepIndex === 0 && state.phase === 'select' && !state.slideSelected
          }
          onModeChange={(mode) => dispatch({ type: 'SET_MODE', payload: mode })}
          onExit={() => navigate('/experiments')}
        />

        <StepIndicator steps={STEPS} activeStep={state.stepIndex} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {state.stepIndex === 5 ? (
              <div className="bg-surface rounded-card border border-stone/10 p-8">
                <InterpretQuiz
                  reactionAnswer={state.answers.reaction}
                  reasoningAnswer={state.answers.reasoning}
                  onAnswer={(field, value) =>
                    dispatch({ type: 'ANSWER', payload: { field, value } })
                  }
                  onSubmit={() => dispatch({ type: 'SUBMIT_INTERPRETATION' })}
                />
              </div>
            ) : (
              <BenchScene
                step={currentStepId}
                phase={state.phase}
                decolorizeStage={state.decolorizeStage}
                activeMistake={state.activeMistake}
                microscopeOn={state.microscopeOn}
                observedResult={state.observedResult}
                onPickReagent={(id) => dispatch({ type: 'PICK_REAGENT', payload: id })}
                onToggleMicroscope={() => dispatch({ type: 'TOGGLE_MICROSCOPE' })}
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
            <ObjectivePanel
              step={currentStepId}
              phase={state.phase}
              mode={state.mode}
              timerMs={state.timerMs}
              decolorizeElapsedMs={state.decolorizeElapsedMs}
              decolorizeStage={state.decolorizeStage}
              activeMistake={state.activeMistake}
              onSelectSlide={() => dispatch({ type: 'SELECT_SLIDE' })}
              onRinse={() => dispatch({ type: 'RINSE' })}
              onApplyDone={() => dispatch({ type: 'APPLY_DONE' })}
              onStopDecolorize={() => dispatch({ type: 'STOP_DECOLORIZE' })}
              onToggleMicroscope={() => dispatch({ type: 'TOGGLE_MICROSCOPE' })}
              onAdvance={() => dispatch({ type: 'ADVANCE' })}
              onDismissMistake={() => dispatch({ type: 'DISMISS_MISTAKE' })}
            />

            <MentorPanel
              mode={state.mode}
              prompt={mentorPrompt}
              greeting="I'm your AI Lab Mentor. Ask me anything about the Gram staining protocol, reagents, or what to do next."
              fallbackHint="remember: sequence matters, and decolorization is the critical step"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
