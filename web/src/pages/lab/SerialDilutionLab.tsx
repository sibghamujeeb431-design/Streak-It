import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { LabHeader } from '../../components/lab/LabHeader'
import { StepIndicator } from '../../components/lab/StepIndicator'
import { SerialDilutionBenchScene } from '../../components/lab/SerialDilutionBenchScene'
import { SerialDilutionObjectivePanel } from '../../components/lab/SerialDilutionObjectivePanel'
import { MentorPanel } from '../../components/lab/MentorPanel'
import { SerialDilutionInterpretQuiz } from '../../components/lab/SerialDilutionInterpretQuiz'
import { ExperimentCompleted } from '../../components/lab/ExperimentCompleted'
import { SerialDilutionPlateView } from '../../components/lab/SerialDilutionPlateView'
import { MicroscopePanel } from '../../components/lab/MicroscopePanel'
import {
  serialDilutionExperiment,
  TICK_MS,
  STEP_ORDER,
  buildMentorContext,
  generateCFUOptions,
} from '../../data/serialDilution'
import { INITIAL_STATE, labReducer } from '../../lib/serialDilutionMachine'
import { useAuth } from '../../context/useAuth'
import { saveAttempt } from '../../lib/experimentAttempts'
import referenceText from '../../../docs/StreakIt_Serial_Dilution_Mentor_Reference.md?raw'

const EXPERIMENT_NAME = serialDilutionExperiment.title
const STEPS = serialDilutionExperiment.steps

export function SerialDilutionLab() {
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
        state.dilutionAccuracy,
        state.dilutionChoice,
        state.mistakes.length > 0
          ? state.mistakes[state.mistakes.length - 1]
          : null,
      ),
    }),
    [
      currentStepId,
      state.phase,
      state.dilutionAccuracy,
      state.dilutionChoice,
      state.mistakes,
    ],
  )

  // Observation window state
  const observationColor = useMemo(() => {
    if (currentStepId === 'prepare') return '#E9E4DB'
    if (currentStepId === 'dilute') {
      if (state.dilutionAccuracy === 'inconsistent') return '#B88B6C'
      const dilutionProgress = state.currentDilutionIndex
      if (dilutionProgress === 0) return '#A89B8C'
      if (dilutionProgress === 1) return '#B88B6C'
      if (dilutionProgress === 2) return '#C99E7C'
      if (dilutionProgress === 3) return '#C99E7C'
      if (dilutionProgress === 4) return '#C99E7C'
      return '#C99E7C'
    }
    if (currentStepId === 'pour-plate') return '#B88B6C'
    if (currentStepId === 'incubate') return '#C99E7C'
    if (currentStepId === 'interpret') {
      if (state.plateResult?.countable) return '#C99E7C'
      if (state.plateResult?.visualState === 'overcrowded') return '#9B7B5C'
      if (state.plateResult?.visualState === 'sparse') return '#A89B8C'
      return '#C99E7C'
    }
    return '#E9E4DB'
  }, [currentStepId, state.currentDilutionIndex, state.phase, state.dilutionAccuracy, state.plateResult])

  const observationCaption = useMemo(() => {
    if (currentStepId === 'prepare') return 'Preparing sample'
    if (currentStepId === 'dilute') {
      if (state.dilutionAccuracy === 'inconsistent') return 'Inconsistent mixing'
      return `Dilution ${state.currentDilutionIndex + 1}`
    }
    if (currentStepId === 'pour-plate') return 'Preparing plate'
    if (currentStepId === 'incubate') return 'Colonies developing'
    if (currentStepId === 'interpret') return 'Final colony count'
    return 'Preparing sample'
  }, [currentStepId, state.currentDilutionIndex, state.phase, state.dilutionAccuracy])

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
              <SerialDilutionPlateView
                plateResult={state.plateResult}
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
              <div className="bg-surface rounded-card border border-stone/10 p-8 space-y-8">
                {state.plateViewOn ? (
                  <div className="flex flex-col items-center gap-3">
                    <SerialDilutionPlateView
                      plateResult={state.plateResult}
                      size={260}
                    />
                  </div>
                ) : (
                  <p className="text-center text-sm text-stone py-6">
                    Switch to Plate View to observe the colony growth before
                    interpreting your results.
                  </p>
                )}
                {state.plateViewOn && (
                  <SerialDilutionInterpretQuiz
                    countabilityAnswer={state.answers.countability}
                    cfuEstimateAnswer={state.answers.cfuEstimate}
                    misconceptionAnswer={state.answers.misconception}
                    plateResult={state.plateResult}
                    selectedDilutionTube={state.selectedDilutionTube}
                    cfuOptions={
                      state.selectedDilutionTube && state.plateResult?.colonyCount
                        ? generateCFUOptions(
                            state.selectedDilutionTube,
                            state.plateResult.colonyCount,
                          )
                        : []
                    }
                    onAnswer={(field, value) =>
                      dispatch({ type: 'ANSWER', payload: { field, value } })
                    }
                    onSubmit={() => dispatch({ type: 'SUBMIT_INTERPRETATION' })}
                  />
                )}
              </div>
            ) : (
              <SerialDilutionBenchScene
                step={currentStepId}
                phase={state.phase}
                selected={state.selected}
                currentDilutionIndex={state.currentDilutionIndex}
                dilutionAccuracy={state.dilutionAccuracy}
                selectedDilutionTube={state.selectedDilutionTube}
                plateViewOn={state.plateViewOn}
                plateResult={state.plateResult}
                activeMistake={state.activeMistake}
                onSelectItem={(id) => dispatch({ type: 'SELECT_ITEM', payload: id })}
                onSelectDilutionTube={(tubeId) =>
                  dispatch({ type: 'SELECT_DILUTION_TUBE', payload: tubeId })
                }
                onTogglePlateView={() => dispatch({ type: 'TOGGLE_PLATE_VIEW' })}
                onTransfer={() => dispatch({ type: 'START_TRANSFER' })}
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
            <SerialDilutionObjectivePanel
              step={currentStepId}
              phase={state.phase}
              mode={state.mode}
              timerMs={state.timerMs}
              currentDilutionIndex={state.currentDilutionIndex}
              plateViewOn={state.plateViewOn}
              activeMistake={state.activeMistake}
              onConfirmPrepare={() => dispatch({ type: 'CONFIRM_PREPARE' })}
              onStartTransfer={() => dispatch({ type: 'START_TRANSFER' })}
              onCompleteTransfer={() => dispatch({ type: 'COMPLETE_TRANSFER' })}
              onSkipMixing={() => dispatch({ type: 'SKIP_MIXING' })}
              onCompleteMixing={() => dispatch({ type: 'COMPLETE_MIXING' })}
              onPourPlate={() => dispatch({ type: 'POUR_PLATE' })}
              onStartIncubation={() => dispatch({ type: 'START_INCUBATION' })}
              onStopIncubation={() => dispatch({ type: 'STOP_INCUBATION' })}
              onTogglePlateView={() => dispatch({ type: 'TOGGLE_PLATE_VIEW' })}
              onAdvance={() => dispatch({ type: 'ADVANCE' })}
              onDismissMistake={() => dispatch({ type: 'DISMISS_MISTAKE' })}
            />

            <MentorPanel
              mode={state.mode}
              prompt={mentorPrompt}
              greeting="I'm your AI Lab Mentor. Ask me anything about serial dilution technique, CFU calculations, or colony counting."
              fallbackHint="remember: proper mixing and choosing the right dilution factor are critical for accurate CFU estimates"
            />
          </div>
        </div>
      </div>

      <MicroscopePanel color={observationColor} caption={observationCaption} />
    </DashboardLayout>
  )
}
