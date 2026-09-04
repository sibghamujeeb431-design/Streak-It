import type { LabMode } from '../data/labCommon'
import type {
  CarryoverTechnique,
  Mistake,
  Phase,
  StepId,
  StreakRegion,
  StreakingOutcome,
} from '../data/streakPlate'
import {
  BENCH_ITEMS,
  CORRECT_ITEM_IDS,
  EMPTY_REGIONS,
  INCUBATE_MS,
  LOOP_COOL_MS,
  REGION_COUNT,
  STEP_ORDER,
  TICK_MS,
} from '../data/streakPlate'
import { computeScore, type ScoreBreakdown } from './streakPlateScoring'

export type LabState = {
  mode: LabMode
  stepIndex: number
  phase: Phase
  selected: Set<string>
  prepareComplete: boolean
  regions: StreakRegion[]
  activeRegion: number
  loopFlamed: boolean
  loopHot: boolean
  coolMs: number
  pendingCarryover: CarryoverTechnique
  contaminated: boolean
  streakingOutcome: StreakingOutcome | null
  timerMs: number
  timerRunning: boolean
  plateViewOn: boolean
  mistakes: Mistake[]
  activeMistake: Mistake | null
  answers: { result: string | null; reasoning: string | null }
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
  regions: EMPTY_REGIONS,
  activeRegion: 0,
  loopFlamed: false,
  loopHot: false,
  coolMs: 0,
  pendingCarryover: 'light',
  contaminated: false,
  streakingOutcome: null,
  timerMs: 0,
  timerRunning: false,
  plateViewOn: false,
  mistakes: [],
  activeMistake: null,
  answers: { result: null, reasoning: null },
  submitted: false,
  score: null,
  finished: false,
}

export type Action =
  | { type: 'SET_MODE'; payload: LabMode }
  | { type: 'SELECT_ITEM'; payload: string }
  | { type: 'CONFIRM_PREPARE' }
  | { type: 'FLAME_LOOP' }
  | { type: 'SET_CARRYOVER'; payload: CarryoverTechnique }
  | { type: 'STREAK_REGION' }
  | { type: 'FINISH_STREAK' }
  | { type: 'START_INCUBATION' }
  | { type: 'STOP_INCUBATION' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_PLATE_VIEW' }
  | { type: 'ADVANCE' }
  | { type: 'DISMISS_MISTAKE' }
  | { type: 'ANSWER'; payload: { field: 'result' | 'reasoning'; value: string } }
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

  if (nextStepId === 'observe') {
    nextPhase = 'observe'
  } else if (nextStepId === 'interpret') {
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
        const contaminated = !item.sterile && (item.kind === 'plate' || item.kind === 'loop')
        nextState = addMistake(
          nextState,
          'wrong-item',
          `${item.name} is not the right choice for this step.`,
        )
        if (contaminated) {
          nextState = { ...nextState, contaminated: true }
        }
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
        phase: 'cooling',
        loopFlamed: true,
        loopHot: true,
        coolMs: LOOP_COOL_MS,
        timerRunning: true,
        activeMistake: null,
      }
    }

    case 'FLAME_LOOP': {
      if (currentStep(state) !== 'streak') return state
      if (state.loopHot) return state

      return {
        ...state,
        loopFlamed: true,
        loopHot: true,
        coolMs: LOOP_COOL_MS,
        phase: 'cooling',
        timerRunning: true,
        activeMistake: null,
      }
    }

    case 'SET_CARRYOVER': {
      if (currentStep(state) !== 'streak') return state
      return { ...state, pendingCarryover: action.payload }
    }

    case 'STREAK_REGION': {
      if (currentStep(state) !== 'streak') return state
      if (state.loopHot) {
        return addMistake(
          state,
          'hot-loop',
          'The loop is still hot. Wait for it to cool before touching the agar.',
        )
      }

      const regionIndex = state.activeRegion
      if (regionIndex >= REGION_COUNT) return state

      const isFirstRegion = regionIndex === 0
      const flamedBefore = isFirstRegion ? state.loopFlamed : state.loopFlamed

      if (!isFirstRegion && !state.loopFlamed) {
        const regionWithMistake = state.regions.map((r, index) =>
          index === regionIndex
            ? { ...r, streaked: true, flamedBefore: false, carryover: state.pendingCarryover }
            : r,
        )
        return addMistake(
          {
            ...state,
            regions: regionWithMistake,
            activeRegion: regionIndex + 1,
            loopFlamed: false,
            contaminated: true,
          },
          'missed-flame',
          'You did not flame the loop before moving to the next region.',
        )
      }

      const regions = state.regions.map((r, index) =>
        index === regionIndex
          ? { ...r, streaked: true, flamedBefore, carryover: state.pendingCarryover }
          : r,
      )

      let nextState = {
        ...state,
        regions,
        activeRegion: regionIndex + 1,
        loopFlamed: false,
      }

      if (state.pendingCarryover === 'heavy') {
        nextState = addMistake(
          nextState,
          'heavy-carryover',
          'Heavy carryover dragged too many cells into the next region.',
        )
      }

      if (nextState.activeRegion >= REGION_COUNT) {
        nextState = { ...nextState, phase: 'done' }
      }

      return nextState
    }

    case 'FINISH_STREAK': {
      if (currentStep(state) !== 'streak') return state
      if (state.phase !== 'done') return state

      const outcome = state.streakingOutcome ?? resolveOutcome(state)
      return nextStep({ ...state, streakingOutcome: outcome })
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

      if (currentStep(state) === 'streak' && state.phase === 'cooling') {
        const nextCool = Math.max(0, state.coolMs - TICK_MS)
        if (nextCool === 0) {
          return {
            ...state,
            coolMs: 0,
            loopHot: false,
            phase: 'select',
            timerRunning: false,
          }
        }
        return { ...state, coolMs: nextCool }
      }

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
      if (currentStep(state) !== 'observe') return state

      const outcome = state.streakingOutcome ?? resolveOutcome(state)
      return {
        ...state,
        plateViewOn: true,
        streakingOutcome: outcome,
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

      const outcome = state.streakingOutcome ?? resolveOutcome(state)
      const score = computeScore(
        state.regions,
        state.contaminated,
        state.mistakes,
        state.answers.result,
        state.answers.reasoning,
      )

      return {
        ...state,
        streakingOutcome: outcome,
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

function resolveOutcome(state: LabState): StreakingOutcome {
  if (state.contaminated) return 'contaminated'

  const streakedCount = state.regions.filter((r) => r.streaked).length
  if (streakedCount < REGION_COUNT) return 'ineffective_pattern'

  const hasHeavyCarryover = state.regions.some((r) => r.carryover === 'heavy')
  if (hasHeavyCarryover) return 'poor_separation'

  return 'correct'
}
