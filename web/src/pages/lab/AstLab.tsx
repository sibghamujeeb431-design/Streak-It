import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { LabHeader } from '../../components/lab/LabHeader'
import { StepIndicator } from '../../components/lab/StepIndicator'
import { AstBenchScene } from '../../components/lab/AstBenchScene'
import { AstObjectivePanel } from '../../components/lab/AstObjectivePanel'
import { MentorPanel } from '../../components/lab/MentorPanel'
import { AstInterpretQuiz } from '../../components/lab/AstInterpretQuiz'
import { ExperimentCompleted } from '../../components/lab/ExperimentCompleted'
import { AstPlateView } from '../../components/lab/AstPlateView'
import { MicroscopePanel } from '../../components/lab/MicroscopePanel'
import {
  astExperiment,
  TICK_MS,
  STEP_ORDER,
  buildMentorContext,
} from '../../data/ast'
import { INITIAL_STATE, labReducer } from '../../lib/astMachine'
import { useAuth } from '../../context/useAuth'
import { saveAttempt } from '../../lib/experimentAttempts'
import referenceText from '../../../docs/StreakIt_AST_Mentor_Reference.md?raw'

const EXPERIMENT_NAME = astExperiment.title
const STEPS = astExperiment.steps

export function AstLab() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [state, dispatch] = useReducer(labReducer, INITIAL_STATE)
  const savedRef = useRef(false)

  const currentStepId = STEP_ORDER[state.stepIndex]

  // Observation window state
  const observationColor = useMemo(() => {
    if (currentStepId === 'prepare') return '#E9E4DB'
    if (currentStepId === 'inoculate') {
      if (state.inoculationQuality === 'uneven') return '#B88B6C'
      return '#A89B8C'
    }
    if (currentStepId === 'discs') {
      const discCount = state.placedDiscs.length
      if (discCount === 0) return '#A89B8C'
      if (discCount === 1) return '#B88B6C'
      if (discCount === 2) return '#C99E7C'
      if (discCount === 3) return '#C99E7C'
      if (discCount === 4) return '#C99E7C'
      return '#C99E7C'
    }
    if (currentStepId === 'incubate') {
      if (state.inoculationQuality === 'uneven') return '#B88B6C'
      return '#C99E7C'
    }
    if (currentStepId === 'interpret') {
      if (state.inoculationQuality === 'uneven') return '#B88B6C'
      return '#C99E7C'
    }
    return '#E9E4DB'
  }, [currentStepId, state.inoculationQuality, state.placedDiscs, state.phase])

  const observationCaption = useMemo(() => {
    if (currentStepId === 'prepare') return 'Preparing culture'
    if (currentStepId === 'inoculate') {
      if (state.inoculationQuality === 'uneven') return 'Uneven lawn'
      return 'Bacterial lawn'
    }
    if (currentStepId === 'discs') {
      const discCount = state.placedDiscs.length
      if (discCount === 0) return 'Place antibiotic discs'
      return `${discCount} disc${discCount > 1 ? 's' : ''} placed`
    }
    if (currentStepId === 'incubate') return 'Incubation in progress'
    if (currentStepId === 'interpret') return 'Final susceptibility pattern'
    return 'Preparing culture'
  }, [currentStepId, state.inoculationQuality, state.placedDiscs, state.phase])

  const mentorPrompt = useMemo(
    () => ({
      referenceText,
      contextString: buildMentorContext(
        currentStepId,
        state.phase,
        state.technique,
        state.inoculationQuality,
        state.placedDiscs,
        state.mistakes.length > 0
          ? state.mistakes[state.mistakes.length - 1]
          : null,
      ),
    }),
    [
      currentStepId,
      state.phase,
      state.technique,
      state.inoculationQuality,
      state.placedDiscs,
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
              <AstPlateView
                placedDiscs={state.placedDiscs}
                quality={state.inoculationQuality}
                grown
                size={160}
                label={false}
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
              <div className="bg-surface rounded-card border border-stone/10 p-8 space-y-8">
                {state.plateViewOn ? (
                  <div className="flex flex-col items-center gap-3">
                    <AstPlateView
                      placedDiscs={state.placedDiscs}
                      quality={state.inoculationQuality}
                      grown
                      size={260}
                      showMeasurements
                    />
                  </div>
                ) : (
                  <p className="text-center text-sm text-stone py-6">
                    Switch to Plate View to observe the inhibition zones before
                    interpreting your results.
                  </p>
                )}
                {state.plateViewOn && (
                  <AstInterpretQuiz
                    classificationAnswer={state.answers.classification}
                    misconceptionAnswer={state.answers.misconception}
                    onAnswer={(field, value) =>
                      dispatch({ type: 'ANSWER', payload: { field, value } })
                    }
                    onSubmit={() => dispatch({ type: 'SUBMIT_INTERPRETATION' })}
                  />
                )}
              </div>
            ) : (
              <AstBenchScene
                step={currentStepId}
                phase={state.phase}
                selected={state.selected}
                technique={state.technique}
                inoculationQuality={state.inoculationQuality}
                placedDiscs={state.placedDiscs}
                activeMistake={state.activeMistake}
                onSelectItem={(id) => dispatch({ type: 'SELECT_ITEM', payload: id })}
                onSetTechnique={(technique) =>
                  dispatch({ type: 'SET_TECHNIQUE', payload: technique })
                }
                onInoculate={() => dispatch({ type: 'INOCULATE' })}
                onPlaceDisc={(id) => dispatch({ type: 'PLACE_DISC', payload: id })}
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
            <AstObjectivePanel
              step={currentStepId}
              phase={state.phase}
              mode={state.mode}
              timerMs={state.timerMs}
              technique={state.technique}
              placedDiscCount={state.placedDiscs.length}
              plateViewOn={state.plateViewOn}
              activeMistake={state.activeMistake}
              onConfirmPrepare={() => dispatch({ type: 'CONFIRM_PREPARE' })}
              onSetTechnique={(technique) =>
                dispatch({ type: 'SET_TECHNIQUE', payload: technique })
              }
              onInoculate={() => dispatch({ type: 'INOCULATE' })}
              onFinishDiscs={() => dispatch({ type: 'FINISH_DISCS' })}
              onStartIncubation={() => dispatch({ type: 'START_INCUBATION' })}
              onStopIncubation={() => dispatch({ type: 'STOP_INCUBATION' })}
              onTogglePlateView={() => dispatch({ type: 'TOGGLE_PLATE_VIEW' })}
              onAdvance={() => dispatch({ type: 'ADVANCE' })}
              onDismissMistake={() => dispatch({ type: 'DISMISS_MISTAKE' })}
            />

            <MentorPanel
              mode={state.mode}
              prompt={mentorPrompt}
              greeting="I'm your AI Lab Mentor. Ask me anything about disc diffusion, Mueller-Hinton plates, or interpreting inhibition zones."
              fallbackHint="remember: judge each drug against its own standardized breakpoints, not by zone size alone"
            />
          </div>
        </div>
      </div>

      <MicroscopePanel color={observationColor} caption={observationCaption} />
    </DashboardLayout>
  )
}
