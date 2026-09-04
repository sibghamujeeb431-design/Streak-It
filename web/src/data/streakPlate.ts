import { experiments } from './experiments'
import type { BenchItem, QuizOption, StepInfo } from './labCommon'

export { type BenchItem, type QuizOption, type StepInfo }

export const streakPlateExperiment = experiments.find((e) => e.slug === 'streak-plate')!

export type StepId = 'prepare' | 'streak' | 'incubate' | 'observe' | 'interpret'

export const STEP_ORDER: StepId[] = [
  'prepare',
  'streak',
  'incubate',
  'observe',
  'interpret',
]

export const STEP_LABELS: Record<StepId, string> = {
  prepare: 'Prepare',
  streak: 'Streak',
  incubate: 'Incubate',
  observe: 'Observe',
  interpret: 'Interpret',
}

export type Phase =
  | 'select'
  | 'cooling'
  | 'streaking'
  | 'incubating'
  | 'observe'
  | 'quiz'
  | 'done'

export const BENCH_ITEMS: BenchItem[] = [
  {
    id: 'bacterial-sample',
    name: 'Bacterial Sample',
    kind: 'sample',
    correct: true,
    sterile: true,
    image: '/images/lab/streak-plate/vial-sample.png',
  },
  {
    id: 'old-culture',
    name: 'Old Broth Culture',
    kind: 'sample',
    correct: false,
    sterile: false,
    image: '/images/lab/streak-plate/vial-sample.png',
  },
  {
    id: 'sterile-plate',
    name: 'Sterile Agar Plate',
    kind: 'plate',
    correct: true,
    sterile: true,
    image: '/images/lab/streak-plate/agar-plate.png',
  },
  {
    id: 'used-plate',
    name: 'Used Agar Plate',
    kind: 'plate',
    correct: false,
    sterile: false,
    image: '/images/lab/streak-plate/agar-plate.png',
  },
  {
    id: 'sterile-loop',
    name: 'Sterile Inoculation Loop',
    kind: 'loop',
    correct: true,
    sterile: true,
    image: '/images/lab/streak-plate/inoculation-loop.png',
  },
  {
    id: 'plastic-loop',
    name: 'Reusable Plastic Loop',
    kind: 'loop',
    correct: false,
    sterile: false,
    image: '/images/lab/streak-plate/inoculation-loop.png',
  },
]

export const CORRECT_ITEM_IDS = new Set(
  BENCH_ITEMS.filter((item) => item.correct).map((item) => item.id),
)

export type CarryoverTechnique = 'light' | 'heavy'

export type StreakRegion = {
  index: number
  streaked: boolean
  flamedBefore: boolean
  carryover: CarryoverTechnique | null
}

export const REGION_COUNT = 4

export const EMPTY_REGIONS: StreakRegion[] = Array.from(
  { length: REGION_COUNT },
  (_, index) => ({
    index,
    streaked: false,
    flamedBefore: false,
    carryover: null,
  }),
)

export type StreakingOutcome =
  | 'correct'
  | 'poor_separation'
  | 'ineffective_pattern'
  | 'contaminated'

export const OUTCOME_LABELS: Record<StreakingOutcome, string> = {
  correct: 'Isolated colonies — great separation',
  poor_separation: 'Poor separation — colonies too crowded',
  ineffective_pattern: 'Ineffective pattern — uneven or incomplete streaking',
  contaminated: 'Contaminated plate — unexpected growth',
}

export const LOOP_COOL_MS = 1500
export const INCUBATE_MS = 3000
export const TICK_MS = 100

export const STEP_INFO: Record<StepId, StepInfo> = {
  prepare: {
    objective: 'Gather the correct sterile materials.',
    instruction: 'Choose the bacterial sample, sterile agar plate, and sterile inoculation loop.',
    actionLabel: 'Confirm Selection',
    helperText: 'The right equipment is the foundation of aseptic technique.',
  },
  streak: {
    objective: 'Streak the plate to progressively separate cells.',
    instruction: 'Flame the loop, let it cool, then streak each region with light carryover.',
    actionLabel: 'Streak Region',
    helperText: 'Flame between regions and avoid heavy carryover.',
  },
  incubate: {
    objective: 'Incubate the plate to allow colonies to grow.',
    instruction: 'Start the incubation timer and wait for growth.',
    actionLabel: 'Start Incubation',
    helperText: 'Colonies need time to become visible.',
  },
  observe: {
    objective: 'Examine the colony pattern on the plate.',
    instruction: 'Switch to the plate view and record what you see.',
    actionLabel: 'Switch to Plate View',
    helperText: 'Look for dense growth fading into isolated colonies.',
  },
  interpret: {
    objective: 'Interpret the result and explain your reasoning.',
    instruction: 'Answer both questions based on the observed plate.',
    actionLabel: 'Submit Interpretation',
    helperText: 'Your score is based on what actually grew on the plate.',
  },
}

export const RESULT_OPTIONS: QuizOption[] = [
  {
    value: 'yes-isolated',
    label: 'Yes — isolated colonies are present',
  },
  {
    value: 'no-crowded',
    label: 'No — colonies are too crowded or uneven',
  },
  {
    value: 'contaminated',
    label: 'The plate is contaminated',
  },
]

export const REASONING_OPTIONS: QuizOption[] = [
  {
    value: 'progressive-dilution',
    label: 'Progressive dilution spread fewer cells into later regions',
  },
  {
    value: 'too-much-carryover',
    label: 'Too much sample was carried into later regions',
  },
  {
    value: 'inconsistent-technique',
    label: 'Inconsistent technique or contamination affected the pattern',
  },
]

export type MistakeKind =
  | 'wrong-item'
  | 'hot-loop'
  | 'missed-flame'
  | 'heavy-carryover'

export type Mistake = {
  step: StepId
  kind: MistakeKind
  message: string
  timestamp: number
}

export function buildMentorContext(
  step: StepId,
  phase: Phase,
  activeRegion: number,
  regions: StreakRegion[],
  recentMistake: Mistake | null,
): string {
  const stepLabel = STEP_LABELS[step]
  const contextParts: string[] = [
    `The student is currently on the ${stepLabel} step (phase: ${phase}).`,
  ]

  if (step === 'streak') {
    const streakedCount = regions.filter((r) => r.streaked).length
    contextParts.push(
      `They have streaked ${streakedCount} of ${REGION_COUNT} regions.`,
    )
    if (activeRegion < REGION_COUNT) {
      contextParts.push(`The active region is region ${activeRegion + 1}.`)
    }
  }

  if (recentMistake) {
    contextParts.push(
      `Their most recent mistake was: ${recentMistake.message} (kind: ${recentMistake.kind}).`,
    )
  }

  if (phase === 'select') {
    contextParts.push('They need to select the correct item or action to proceed.')
  } else if (phase === 'cooling') {
    contextParts.push('They are waiting for the inoculation loop to cool after flaming.')
  } else if (phase === 'streaking') {
    contextParts.push('They need to streak the active region with the correct carryover.')
  } else if (phase === 'incubating') {
    contextParts.push('They are waiting for the incubation timer to finish.')
  } else if (phase === 'observe') {
    contextParts.push('They need to reveal the plate and observe the colony pattern.')
  } else if (phase === 'quiz') {
    contextParts.push('They are answering the interpretation quiz.')
  }

  return contextParts.join(' ')
}
