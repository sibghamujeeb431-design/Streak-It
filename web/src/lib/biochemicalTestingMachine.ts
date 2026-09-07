import type { LabMode } from '../data/labCommon'
import type {
  InoculationQuality,
  Mistake,
  Phase,
  ReactionResult,
  StepId,
  TestTubeId,
} from '../data/biochemicalTesting'
import {
  BENCH_ITEMS,
  CORRECT_ITEM_IDS,
  INCUBATE_MS,
  ORGANISM_PROFILE,
  STEP_ORDER,
  TEST_TUBES,
  TICK_MS,
} from '../data/biochemicalTesting'
import { computeScore, type ScoreBreakdown } from './biochemicalTestingScoring'

export type LabState = {
  mode: LabMode
  stepIndex: number
  phase: Phase
  selected: Set<string>
  prepareComplete: boolean
  inoculationQuality: InoculationQuality | null
  inoculatedTubes: TestTubeId[]
  observedReactions: ReactionResult[]
  timerMs: number
  timerRunning: boolean
  mistakes: Mistake[]
  activeMistake: Mistake | null
  answers: { organism: string | null; misconception: string | null }
  submitted: boolean
  score: ScoreBreakdown | null
  finished: boolean
}

export const INITIAL_STATE: LabState = {
  mode: 'learn',
  stepIndex: 0,
  phase: 'select',
  selected: new Set(),
  prepareComplete: false,
  inoculationQuality: null,
  inoculatedTubes: [],
  observedReactions: [],
  timerMs: 0,
  timerRunning: false,
  mistakes: [],
  activeMistake: null,
  answers: { organism: null, misconception: null },
  submitted: false,
  score: null,
  finished: false,
}

export type Action =
  | { type: 'SET_MODE'; payload: LabMode }
  | { type: 'SELECT_ITEM'; payload: string }
  | { type: 'CONFIRM_PREPARE' }
  | { type: 'INOCULATE_TUBE'; payload: TestTubeId }
  | { type: 'FINISH_INOCULATION' }
  | { type: 'START_INCUBATION' }
  | { type: 'STOP_INCUBATION' }
  | { type: 'TICK' }
  | { type: 'OBSERVE_TUBE'; payload: TestTubeId }
  | { type: 'FINISH_OBSERVATION' }
  | { type: 'ADVANCE' }
  | { type: 'DISMISS_MISTAKE' }
  | {
      type: 'ANSWER'
      payload: { field: 'organism' | 'misconception'; value: string }
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
  return count === 3
}

function nextStep(state: LabState): LabState {
  const nextIndex = state.stepIndex + 1
  if (nextIndex >= STEP_ORDER.length) {
    return { ...state, finished: true }
  }

  const nextStepId = STEP_ORDER[nextIndex]
  let nextPhase: Phase = 'select'

  if (nextStepId === 'interpret') {
    nextPhase = 'quiz'
  } else if (nextStepId === 'observe') {
    nextPhase = 'observing'
  }

  return {
    ...state,
    stepIndex: nextIndex,
    phase: nextPhase,
    activeMistake: null,
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
      return nextStep(state)
    }

    case 'INOCULATE_TUBE': {
      if (currentStep(state) !== 'inoculate') return state
      if (state.phase !== 'select') return state
      if (state.inoculatedTubes.includes(action.payload)) return state

      const inoculatedTubes = [...state.inoculatedTubes, action.payload]
      return { ...state, inoculatedTubes }
    }

    case 'FINISH_INOCULATION': {
      if (currentStep(state) !== 'inoculate') return state
      if (state.inoculatedTubes.length < TEST_TUBES.length) {
        return addMistake(
          state,
          'incomplete-inoculation',
          `You only inoculated ${state.inoculatedTubes.length} of ${TEST_TUBES.length} test tubes. All tubes must be inoculated for reliable results.`,
        )
      }

      return {
        ...state,
        inoculationQuality: 'correct',
        phase: 'done',
      }
    }

    case 'START_INCUBATION': {
      if (currentStep(state) !== 'incubate') return state
      if (state.phase !== 'select') return state

      return {
        ...state,
        phase: 'incubating',
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
          return { ...state, timerMs: 0, timerRunning: false, phase: 'done' }
        }
        // Test Mode: the timer holds at zero until the student stops it.
        return { ...state, timerMs: 0, timerRunning: false }
      }
      return { ...state, timerMs: nextTimer }
    }

    case 'OBSERVE_TUBE': {
      if (currentStep(state) !== 'observe') return state
      if (state.phase !== 'observing') return state

      const tubeId = action.payload
      if (state.observedReactions.find((r) => r.tubeId === tubeId)) return state

      // Determine result based on inoculation quality
      let result: 'positive' | 'negative' | 'ambiguous'
      if (state.inoculationQuality === 'incomplete') {
        result = 'ambiguous'
      } else {
        result = ORGANISM_PROFILE[tubeId]
      }

      const observedReactions = [
        ...state.observedReactions,
        { tubeId, result, observed: true },
      ]

      return { ...state, observedReactions }
    }

    case 'FINISH_OBSERVATION': {
      if (currentStep(state) !== 'observe') return state
      if (state.observedReactions.length < TEST_TUBES.length) {
        return addMistake(
          state,
          'incomplete-inoculation',
          `You only observed ${state.observedReactions.length} of ${TEST_TUBES.length} test tube reactions. All reactions must be recorded.`,
        )
      }

      return { ...state, phase: 'done' }
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
      if (state.phase !== 'quiz') return state

      const quality = state.inoculationQuality ?? 'correct'
      const score = computeScore(
        quality,
        state.mistakes,
        state.observedReactions,
        state.answers.organism,
        state.answers.misconception,
      )

      return {
        ...state,
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
