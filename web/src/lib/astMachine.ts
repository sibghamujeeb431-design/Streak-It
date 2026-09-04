import type { LabMode } from '../data/labCommon'
import type {
  DiscId,
  InoculationQuality,
  InoculationTechnique,
  Mistake,
  Phase,
  StepId,
} from '../data/ast'
import {
  BENCH_ITEMS,
  CORRECT_ITEM_IDS,
  INCUBATE_MS,
  MAX_DISCS,
  MIN_DISCS,
  STEP_ORDER,
  TICK_MS,
} from '../data/ast'
import { computeScore, type ScoreBreakdown } from './astScoring'

export type LabState = {
  mode: LabMode
  stepIndex: number
  phase: Phase
  selected: Set<string>
  prepareComplete: boolean
  technique: InoculationTechnique
  inoculationQuality: InoculationQuality | null
  placedDiscs: DiscId[]
  timerMs: number
  timerRunning: boolean
  plateViewOn: boolean
  mistakes: Mistake[]
  activeMistake: Mistake | null
  answers: { classification: string | null; misconception: string | null }
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
  technique: 'even-lawn',
  inoculationQuality: null,
  placedDiscs: [],
  timerMs: 0,
  timerRunning: false,
  plateViewOn: false,
  mistakes: [],
  activeMistake: null,
  answers: { classification: null, misconception: null },
  submitted: false,
  score: null,
  finished: false,
}

export type Action =
  | { type: 'SET_MODE'; payload: LabMode }
  | { type: 'SELECT_ITEM'; payload: string }
  | { type: 'CONFIRM_PREPARE' }
  | { type: 'SET_TECHNIQUE'; payload: InoculationTechnique }
  | { type: 'INOCULATE' }
  | { type: 'PLACE_DISC'; payload: DiscId }
  | { type: 'FINISH_DISCS' }
  | { type: 'START_INCUBATION' }
  | { type: 'STOP_INCUBATION' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_PLATE_VIEW' }
  | { type: 'ADVANCE' }
  | { type: 'DISMISS_MISTAKE' }
  | {
      type: 'ANSWER'
      payload: { field: 'classification' | 'misconception'; value: string }
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

    case 'SET_TECHNIQUE': {
      if (currentStep(state) !== 'inoculate') return state
      return { ...state, technique: action.payload }
    }

    case 'INOCULATE': {
      if (currentStep(state) !== 'inoculate') return state

      if (state.technique === 'quick-swipe') {
        return addMistake(
          { ...state, inoculationQuality: 'uneven', phase: 'done' },
          'uneven-inoculation',
          'A single quick swipe leaves an uneven lawn. Zone edges will be distorted.',
        )
      }

      return { ...state, inoculationQuality: 'even', phase: 'done' }
    }

    case 'PLACE_DISC': {
      if (currentStep(state) !== 'discs') return state
      if (state.phase === 'done') return state
      if (state.placedDiscs.includes(action.payload)) return state
      if (state.placedDiscs.length >= MAX_DISCS) return state

      const placedDiscs = [...state.placedDiscs, action.payload]
      return { ...state, placedDiscs }
    }

    case 'FINISH_DISCS': {
      if (currentStep(state) !== 'discs') return state
      if (state.placedDiscs.length < MIN_DISCS) return state
      return { ...state, phase: 'done' }
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

    case 'TOGGLE_PLATE_VIEW': {
      if (currentStep(state) !== 'interpret') return state
      if (state.plateViewOn) return state

      return { ...state, plateViewOn: true }
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

      const quality = state.inoculationQuality ?? 'even'
      const score = computeScore(
        quality,
        state.mistakes,
        state.answers.classification,
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
