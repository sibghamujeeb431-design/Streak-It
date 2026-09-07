import type { LabMode } from '../data/labCommon'
import type {
  DilutionAccuracy,
  DilutionChoice,
  DilutionTubeId,
  Mistake,
  Phase,
  PlateResult,
  StepId,
} from '../data/serialDilution'
import {
  BENCH_ITEMS,
  CORRECT_ITEM_IDS,
  DILUTION_TUBES,
  INCUBATE_MS,
  MIX_MS,
  PHASE,
  STEP_ORDER,
  TICK_MS,
  TRANSFER_MS,
} from '../data/serialDilution'
import { computeScore, type ScoreBreakdown } from './serialDilutionScoring'

export type LabState = {
  mode: LabMode
  stepIndex: number
  phase: Phase
  selected: Set<string>
  prepareComplete: boolean
  currentDilutionIndex: number
  dilutionAccuracy: DilutionAccuracy | null
  dilutionChoice: DilutionChoice | null
  selectedDilutionTube: DilutionTubeId | null
  timerMs: number
  timerRunning: boolean
  plateViewOn: boolean
  plateResult: PlateResult | null
  mistakes: Mistake[]
  activeMistake: Mistake | null
  answers: {
    countability: string | null
    cfuEstimate: string | null
    misconception: string | null
  }
  submitted: boolean
  score: ScoreBreakdown | null
  finished: boolean
}

export const INITIAL_STATE: LabState = {
  mode: 'learn',
  stepIndex: 0,
  phase: PHASE.select,
  selected: new Set(),
  prepareComplete: false,
  currentDilutionIndex: 0,
  dilutionAccuracy: null,
  dilutionChoice: null,
  selectedDilutionTube: null,
  timerMs: 0,
  timerRunning: false,
  plateViewOn: false,
  plateResult: null,
  mistakes: [],
  activeMistake: null,
  answers: {
    countability: null,
    cfuEstimate: null,
    misconception: null,
  },
  submitted: false,
  score: null,
  finished: false,
}

export type Action =
  | { type: 'SET_MODE'; payload: LabMode }
  | { type: 'SELECT_ITEM'; payload: string }
  | { type: 'CONFIRM_PREPARE' }
  | { type: 'START_TRANSFER' }
  | { type: 'COMPLETE_TRANSFER' }
  | { type: 'SKIP_MIXING' }
  | { type: 'COMPLETE_MIXING' }
  | { type: 'SELECT_DILUTION_TUBE'; payload: DilutionTubeId }
  | { type: 'POUR_PLATE' }
  | { type: 'START_INCUBATION' }
  | { type: 'STOP_INCUBATION' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_PLATE_VIEW' }
  | { type: 'ADVANCE' }
  | { type: 'DISMISS_MISTAKE' }
  | {
      type: 'ANSWER'
      payload: { field: 'countability' | 'cfuEstimate' | 'misconception'; value: string }
    }
  | { type: 'SUBMIT_INTERPRETATION' }
  | { type: 'RESET' }

function currentStep(state: LabState): StepId {
  return STEP_ORDER[state.stepIndex]
}

function addMistake(
  state: LabState,
  kind: Mistake['kind'],
  message: string,
): LabState {
  const mistake: Mistake = {
    step: currentStep(state),
    kind,
    message,
    timestamp: Date.now(),
  }
  return {
    ...state,
    activeMistake: mistake,
    mistakes: [...state.mistakes, mistake],
  }
}

function canChangeMode(state: LabState): boolean {
  return state.stepIndex === 0 && state.phase === 'select' && state.selected.size === 0
}

function hasAllCorrectItems(selected: Set<string>): boolean {
  let count = 0
  for (const id of selected) {
    if (CORRECT_ITEM_IDS.has(id)) count += 1
  }
  return count === 4 // sample, tubes, micropipette, petri dish
}

function nextStep(state: LabState): LabState {
  const nextIndex = state.stepIndex + 1
  if (nextIndex >= STEP_ORDER.length) {
    return { ...state, finished: true }
  }

  const nextStepId = STEP_ORDER[nextIndex]
  const nextPhase = nextStepId === 'interpret' ? PHASE.quiz : PHASE.select

  return {
    ...state,
    stepIndex: nextIndex,
    phase: nextPhase,
    activeMistake: null,
  }
}

function resolvePlateResult(
  dilutionChoice: DilutionChoice,
  dilutionAccuracy: DilutionAccuracy,
): PlateResult {
  if (dilutionChoice === 'optimal' && dilutionAccuracy === 'correct') {
    // Optimal dilution with correct technique: countable colonies
    const colonyCount = Math.floor(Math.random() * (300 - 30 + 1)) + 30 // 30-300 colonies
    return {
      countable: true,
      colonyCount,
      visualState: 'optimal',
    }
  }

  if (dilutionChoice === 'too_concentrated') {
    // Too concentrated: overcrowded lawn
    return {
      countable: false,
      colonyCount: null,
      visualState: 'overcrowded',
    }
  }

  if (dilutionChoice === 'too_dilute') {
    // Too dilute: very few colonies
    const colonyCount = Math.floor(Math.random() * 10) // 0-9 colonies
    return {
      countable: false,
      colonyCount,
      visualState: 'sparse',
    }
  }

  // Inconsistent accuracy with any choice
  return {
    countable: false,
    colonyCount: Math.floor(Math.random() * 50),
    visualState: 'inconsistent',
  }
}

export function labReducer(state: LabState, action: Action): LabState {
  switch (action.type) {
    case 'SET_MODE': {
      if (!canChangeMode(state)) return state
      return { ...state, mode: action.payload }
    }

    case 'SELECT_ITEM': {
      if (currentStep(state) !== 'prepare') return state
      if (state.prepareComplete) return state

      const itemId = action.payload
      if (state.selected.has(itemId)) return state

      const item = BENCH_ITEMS.find((i) => i.id === itemId)
      if (!item) return state

      let nextState = {
        ...state,
        selected: new Set([...state.selected, itemId]),
      }

      if (!item.correct) {
        nextState = addMistake(
          nextState,
          'wrong-item',
          `${item.name} is not the right choice for this step.`,
        )
      }

      if (hasAllCorrectItems(nextState.selected)) {
        nextState = { ...nextState, phase: 'done', prepareComplete: true }
      }

      return nextState
    }

    case 'CONFIRM_PREPARE': {
      if (currentStep(state) !== 'prepare') return state
      if (state.phase !== 'done') return state

      return {
        ...state,
        stepIndex: 1,
        phase: PHASE.select,
        currentDilutionIndex: 0,
        activeMistake: null,
      }
    }

    case 'START_TRANSFER': {
      if (currentStep(state) !== 'dilute') return state
      if (state.phase !== 'select') return state

      return {
        ...state,
        phase: PHASE.transferring,
        timerMs: TRANSFER_MS,
        timerRunning: true,
        activeMistake: null,
      }
    }

    case 'COMPLETE_TRANSFER': {
      if (currentStep(state) !== 'dilute') return state
      if (state.phase !== 'transferring') return state

      return {
        ...state,
        phase: PHASE.mixing,
        timerMs: MIX_MS,
        timerRunning: true,
      }
    }

    case 'SKIP_MIXING': {
      if (currentStep(state) !== 'dilute') return state
      if (state.phase !== 'transferring') return state

      const nextState = addMistake(
        state,
        'skipped-mixing',
        'You skipped mixing the dilution. This affects accuracy.',
      )
      
      const nextIndex = nextState.currentDilutionIndex + 1
      const nextPhase = nextIndex >= DILUTION_TUBES.length ? PHASE.done : PHASE.select

      return {
        ...nextState,
        dilutionAccuracy: 'inconsistent',
        currentDilutionIndex: nextIndex,
        phase: nextPhase,
        timerRunning: false,
      }
    }

    case 'COMPLETE_MIXING': {
      if (currentStep(state) !== 'dilute') return state
      if (state.phase !== 'mixing') return state

      const nextIndex = state.currentDilutionIndex + 1
      const nextPhase = nextIndex >= DILUTION_TUBES.length ? PHASE.done : PHASE.select
      
      return {
        ...state,
        currentDilutionIndex: nextIndex,
        phase: nextPhase,
        timerRunning: false,
      }
    }

    case 'SELECT_DILUTION_TUBE': {
      if (currentStep(state) !== 'pour-plate') return state
      if (state.phase !== 'select') return state

      const tubeId = action.payload
      let dilutionChoice: DilutionChoice

      // Determine if the choice is optimal, too concentrated, or too dilute
      if (tubeId === '10^-3' || tubeId === '10^-4') {
        dilutionChoice = 'optimal'
      } else if (tubeId === '10^-1' || tubeId === '10^-2') {
        dilutionChoice = 'too_concentrated'
      } else {
        dilutionChoice = 'too_dilute'
      }

      return {
        ...state,
        selectedDilutionTube: tubeId,
        dilutionChoice,
        phase: PHASE.done,
      }
    }

    case 'POUR_PLATE': {
      if (currentStep(state) !== 'pour-plate') return state
      if (state.phase !== 'done') return state

      return nextStep(state)
    }

    case 'START_INCUBATION': {
      if (currentStep(state) !== 'incubate') return state
      if (state.phase !== 'select') return state

      return {
        ...state,
        phase: PHASE.incubating,
        timerMs: INCUBATE_MS,
        timerRunning: true,
        activeMistake: null,
      }
    }

    case 'STOP_INCUBATION': {
      if (currentStep(state) !== 'incubate') return state
      if (state.phase !== 'incubating') return state

      // Test Mode: the student judges the incubation time and stops manually.
      return { ...state, timerRunning: false, phase: 'done' }
    }

    case 'TICK': {
      if (!state.timerRunning) return state

      const nextTimer = Math.max(0, state.timerMs - TICK_MS)
      if (nextTimer === 0) {
        if (state.mode === 'learn') {
          if (state.phase === 'transferring') {
            return { ...state, timerMs: MIX_MS, timerRunning: true, phase: PHASE.mixing }
          } else if (state.phase === 'mixing') {
            const nextIndex = state.currentDilutionIndex + 1
            const nextPhase = nextIndex >= DILUTION_TUBES.length ? PHASE.done : PHASE.select
            return { 
              ...state, 
              timerMs: 0, 
              timerRunning: false, 
              phase: nextPhase, 
              currentDilutionIndex: nextIndex 
            }
          } else if (state.phase === 'incubating') {
            return { ...state, timerMs: 0, timerRunning: false, phase: PHASE.done }
          } else {
            return { ...state, timerMs: 0, timerRunning: false, phase: PHASE.done }
          }
        }
        // Test Mode: the timer holds at zero until the student stops it.
        return { ...state, timerMs: 0, timerRunning: false }
      }
      return { ...state, timerMs: nextTimer }
    }

    case 'TOGGLE_PLATE_VIEW': {
      if (currentStep(state) !== 'interpret') return state

      const accuracy = state.dilutionAccuracy ?? 'correct'
      const choice = state.dilutionChoice ?? 'optimal'
      const plateResult = resolvePlateResult(choice, accuracy)

      return {
        ...state,
        plateViewOn: true,
        plateResult,
        phase: 'done',
      }
    }

    case 'ADVANCE': {
      if (state.phase !== 'done') return state
      return nextStep(state)
    }

    case 'DISMISS_MISTAKE': {
      return { ...state, activeMistake: null }
    }

    case 'ANSWER': {
      const { field, value } = action.payload
      return {
        ...state,
        answers: { ...state.answers, [field]: value },
      }
    }

    case 'SUBMIT_INTERPRETATION': {
      if (currentStep(state) !== 'interpret') return state
      if (!state.plateViewOn) return state

      const accuracy = state.dilutionAccuracy ?? 'correct'
      const choice = state.dilutionChoice ?? 'optimal'
      const plateResult = state.plateResult ?? resolvePlateResult(choice, accuracy)

      const score = computeScore(
        state.mistakes,
        choice,
        plateResult,
        state.answers.countability,
        state.answers.cfuEstimate,
        state.answers.misconception,
        state.selectedDilutionTube,
      )

      return {
        ...state,
        plateResult,
        score,
        submitted: true,
        finished: true,
        phase: 'done',
      }
    }

    case 'RESET': {
      return { ...INITIAL_STATE, mode: state.mode }
    }

    default:
      return state
  }
}
