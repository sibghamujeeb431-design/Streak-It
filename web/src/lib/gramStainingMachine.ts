import type {
  DecolorizationOutcome,
  DecolorizeStage,
  GramType,
  LabMode,
  Mistake,
  ObservedResult,
  Phase,
  ReagentId,
  StepId,
} from '../data/gramStaining'
import {
  DECOLORIZE_MAX_MS,
  DECOLORIZE_OVER_MS,
  DECOLORIZE_UNDER_MS,
  STAIN_DURATION_MS,
  STEP_ORDER,
  TICK_MS,
} from '../data/gramStaining'
import { computeScore, resolveObservedResult, type ScoreBreakdown } from './gramStainingScoring'

export type LabState = {
  mode: LabMode
  stepIndex: number
  phase: Phase
  slideSelected: boolean
  decolorizeStage: DecolorizeStage
  decolorizeElapsedMs: number
  decolorizationOutcome: DecolorizationOutcome
  timerMs: number
  timerRunning: boolean
  reagentLog: { step: StepId; reagent: ReagentId }[]
  mistakes: Mistake[]
  activeMistake: Mistake | null
  trueGramType: GramType
  microscopeOn: boolean
  observedResult: ObservedResult
  answers: { reaction: string | null; reasoning: string | null }
  submitted: boolean
  score: ScoreBreakdown | null
  finished: boolean
}

export const INITIAL_STATE: LabState = {
  mode: 'learn',
  stepIndex: 0,
  phase: 'select',
  slideSelected: false,
  decolorizeStage: null,
  decolorizeElapsedMs: 0,
  decolorizationOutcome: null,
  timerMs: 0,
  timerRunning: false,
  reagentLog: [],
  mistakes: [],
  activeMistake: null,
  trueGramType: 'positive',
  microscopeOn: false,
  observedResult: null,
  answers: { reaction: null, reasoning: null },
  submitted: false,
  score: null,
  finished: false,
}

export type Action =
  | { type: 'SET_MODE'; payload: LabMode }
  | { type: 'SELECT_SLIDE' }
  | { type: 'PICK_REAGENT'; payload: ReagentId }
  | { type: 'TICK' }
  | { type: 'APPLY_DONE' }
  | { type: 'RINSE' }
  | { type: 'START_DECOLORIZE' }
  | { type: 'STOP_DECOLORIZE' }
  | { type: 'DISMISS_MISTAKE' }
  | { type: 'TOGGLE_MICROSCOPE' }
  | { type: 'ADVANCE' }
  | { type: 'ANSWER'; payload: { field: 'reaction' | 'reasoning'; value: string } }
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
  return state.stepIndex === 0 && state.phase === 'select' && !state.slideSelected
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

    case 'SELECT_SLIDE': {
      if (currentStep(state) !== 'prepare') return state
      return { ...state, slideSelected: true, phase: 'done' }
    }

    case 'PICK_REAGENT': {
      if (state.activeMistake) return state
      const reagent = action.payload
      const step = currentStep(state)

      if (step === 'stain') {
        if (reagent !== 'crystal-violet') {
          return addMistake(
            state,
            'wrong-reagent',
            `${getReagentName(reagent)} is not the primary stain. Use Crystal Violet first.`,
          )
        }
        return {
          ...state,
          reagentLog: [...state.reagentLog, { step, reagent }],
          phase: 'apply',
          timerMs: STAIN_DURATION_MS,
          timerRunning: true,
          activeMistake: null,
        }
      }

      if (step === 'decolorize') {
        if (state.decolorizeStage === null) {
          if (reagent !== 'iodine') {
            return addMistake(
              state,
              'wrong-order',
              `Apply Gram's Iodine before using the decolorizer. The mordant fixes the primary stain.`,
            )
          }
          return {
            ...state,
            reagentLog: [...state.reagentLog, { step, reagent }],
            decolorizeStage: 'iodine',
            phase: 'apply',
            timerMs: STAIN_DURATION_MS,
            timerRunning: true,
            activeMistake: null,
          }
        }

        if (state.decolorizeStage === 'iodine') {
          if (reagent !== 'decolorizer') {
            return addMistake(
              state,
              'wrong-reagent',
              `After iodine, the next reagent is the decolorizer. ${getReagentName(reagent)} does not belong here.`,
            )
          }
          return {
            ...state,
            reagentLog: [...state.reagentLog, { step, reagent }],
            decolorizeStage: 'decolorizer',
            phase: 'decolorize',
            decolorizeElapsedMs: 0,
            timerRunning: true,
            activeMistake: null,
          }
        }

        return state
      }

      if (step === 'counterstain') {
        if (reagent !== 'safranin') {
          return addMistake(
            state,
            'wrong-reagent',
            `${getReagentName(reagent)} is not the counterstain. Use Safranin at this step.`,
          )
        }
        return {
          ...state,
          reagentLog: [...state.reagentLog, { step, reagent }],
          phase: 'apply',
          timerMs: STAIN_DURATION_MS,
          timerRunning: true,
          activeMistake: null,
        }
      }

      return state
    }

    case 'TICK': {
      if (!state.timerRunning) return state

      if (state.phase === 'decolorize') {
        const nextElapsed = state.decolorizeElapsedMs + TICK_MS
        if (nextElapsed >= DECOLORIZE_MAX_MS) {
          return stopDecolorize(state, 'over')
        }
        return { ...state, decolorizeElapsedMs: nextElapsed }
      }

      // Countdown timer for apply phases.
      const nextTimer = Math.max(0, state.timerMs - TICK_MS)
      if (nextTimer === 0) {
        if (state.mode === 'learn') {
          return { ...state, timerMs: 0, timerRunning: false, phase: 'rinse' }
        }
        // Test Mode: the timer holds at zero until the student stops it.
        return { ...state, timerMs: 0, timerRunning: false }
      }
      return { ...state, timerMs: nextTimer }
    }

    case 'APPLY_DONE': {
      // Test Mode: manual stop for apply timers; the student judges the timing.
      if (state.phase !== 'apply') return state
      return { ...state, timerMs: 0, timerRunning: false, phase: 'rinse' }
    }

    case 'RINSE': {
      if (state.phase !== 'rinse') return state
      const step = currentStep(state)

      if (step === 'stain') {
        return nextStep(state)
      }

      if (step === 'decolorize') {
        if (state.decolorizeStage === 'iodine') {
          return {
            ...state,
            phase: 'select',
            activeMistake: null,
          }
        }
        return nextStep(state)
      }

      if (step === 'counterstain') {
        return nextStep(state)
      }

      return state
    }

    case 'START_DECOLORIZE': {
      if (state.phase !== 'decolorize') return state
      return { ...state, timerRunning: true }
    }

    case 'STOP_DECOLORIZE': {
      if (state.phase !== 'decolorize') return state
      const elapsed = state.decolorizeElapsedMs
      let outcome: DecolorizationOutcome
      if (elapsed < DECOLORIZE_UNDER_MS) {
        outcome = 'under'
      } else if (elapsed <= DECOLORIZE_OVER_MS) {
        outcome = 'correct'
      } else {
        outcome = 'over'
      }
      return stopDecolorize(state, outcome)
    }

    case 'DISMISS_MISTAKE': {
      return { ...state, activeMistake: null }
    }

    case 'TOGGLE_MICROSCOPE': {
      if (currentStep(state) !== 'observe') return state
      const observed = resolveObservedResult(
        state.trueGramType,
        state.decolorizationOutcome,
      )
      return {
        ...state,
        microscopeOn: true,
        observedResult: observed,
        phase: 'done',
      }
    }

    case 'ADVANCE': {
      if (state.phase !== 'done') return state
      return nextStep(state)
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
      const score = computeScore(
        state.trueGramType,
        state.mistakes,
        state.decolorizationOutcome,
        state.answers.reaction,
        state.answers.reasoning,
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

function stopDecolorize(
  state: LabState,
  outcome: DecolorizationOutcome,
): LabState {
  return {
    ...state,
    decolorizationOutcome: outcome,
    timerRunning: false,
    phase: 'rinse',
  }
}

function getReagentName(id: ReagentId): string {
  const names: Record<ReagentId, string> = {
    'crystal-violet': 'Crystal Violet',
    iodine: "Gram's Iodine",
    decolorizer: 'Decolorizer',
    safranin: 'Safranin',
  }
  return names[id]
}
