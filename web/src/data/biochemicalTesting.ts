import { experiments } from './experiments'
import type { BenchItem, QuizOption, StepInfo } from './labCommon'

export { type BenchItem, type QuizOption, type StepInfo }

export const biochemicalTestingExperiment = experiments.find((e) => e.slug === 'biochemical-testing')!

export type StepId = 'prepare' | 'inoculate' | 'incubate' | 'observe' | 'interpret'

export const STEP_ORDER: StepId[] = [
  'prepare',
  'inoculate',
  'incubate',
  'observe',
  'interpret',
]

export const STEP_LABELS: Record<StepId, string> = {
  prepare: 'Prepare',
  inoculate: 'Inoculate',
  incubate: 'Incubate',
  observe: 'Observe Reactions',
  interpret: 'Interpret',
}

export type Phase =
  | 'select'
  | 'inoculating'
  | 'incubating'
  | 'observing'
  | 'quiz'
  | 'done'

export const BENCH_ITEMS: BenchItem[] = [
  {
    id: 'unknown-sample',
    name: 'Unknown Bacterial Culture',
    kind: 'sample',
    correct: true,
    sterile: true,
    subtitle: 'Sample',
    image: '/images/lab/ast/vial-sample.png',
  },
  {
    id: 'old-culture',
    name: 'Old Broth Culture',
    kind: 'sample',
    correct: false,
    sterile: false,
    subtitle: 'Sample',
    image: '/images/lab/ast/vial-sample.png',
  },
  {
    id: 'test-tubes',
    name: 'Biochemical Test Tubes',
    kind: 'tubes',
    correct: true,
    sterile: true,
    subtitle: '5 test tubes',
    image: '/images/lab/ast/vial-sample.png',
  },
  {
    id: 'contaminated-tubes',
    name: 'Contaminated Test Tubes',
    kind: 'tubes',
    correct: false,
    sterile: false,
    subtitle: '5 test tubes',
    image: '/images/lab/ast/vial-sample.png',
  },
  {
    id: 'inoculating-loop',
    name: 'Inoculating Loop',
    kind: 'tool',
    correct: true,
    sterile: true,
    subtitle: 'Inoculation tool',
    image: '/images/lab/streak-plate/inoculation-loop.png',
  },
  {
    id: 'used-loop',
    name: 'Used Inoculating Loop',
    kind: 'tool',
    correct: false,
    sterile: false,
    subtitle: 'Inoculation tool',
    image: '/images/lab/streak-plate/inoculation-loop.png',
  },
]

export const CORRECT_ITEM_IDS = new Set(
  BENCH_ITEMS.filter((item) => item.correct).map((item) => item.id),
)

export type InoculationQuality = 'correct' | 'incomplete'

export type TestTubeId = 'catalase' | 'oxidase' | 'indole' | 'citrate' | 'urease'

export const TEST_TUBES: TestTubeId[] = ['catalase', 'oxidase', 'indole', 'citrate', 'urease']

export const TEST_TUBE_INFO: Record<TestTubeId, { name: string; reagent: string; description: string }> = {
  catalase: {
    name: 'Catalase',
    reagent: 'H2O2',
    description: 'Tests for catalase enzyme',
  },
  oxidase: {
    name: 'Oxidase',
    reagent: 'TMPD',
    description: 'Tests for cytochrome oxidase',
  },
  indole: {
    name: 'Indole',
    reagent: 'Kovacs',
    description: 'Tests for tryptophanase',
  },
  citrate: {
    name: 'Citrate',
    reagent: 'Simmons',
    description: 'Tests for citrate utilization',
  },
  urease: {
    name: 'Urease',
    reagent: 'Christensen',
    description: 'Tests for urease enzyme',
  },
}

export type TestResult = 'positive' | 'negative' | 'ambiguous'

// Fixed organism profile for consistent scoring
// This represents a specific unknown organism (e.g., E. coli-like profile)
export const ORGANISM_PROFILE: Record<TestTubeId, TestResult> = {
  catalase: 'positive', // Bubbles with H2O2
  oxidase: 'negative', // No color change with TMPD
  indole: 'positive', // Red ring with Kovacs
  citrate: 'positive', // Blue with Simmons citrate
  urease: 'negative', // No color change with Christensen
}

export const TEST_MEANINGS: Record<TestTubeId, { positive: string; negative: string }> = {
  catalase: {
    positive: 'Bubble formation',
    negative: 'No bubble',
  },
  oxidase: {
    positive: 'Purple color change',
    negative: 'No color change',
  },
  indole: {
    positive: 'Red ring',
    negative: 'No red ring',
  },
  citrate: {
    positive: 'Blue color',
    negative: 'Green color',
  },
  urease: {
    positive: 'Pink color',
    negative: 'Yellow color',
  },
}

export type ReactionResult = {
  tubeId: TestTubeId
  result: TestResult
  observed: boolean
}

export const INCUBATE_MS = 3000
export const TICK_MS = 100

export const STEP_INFO: Record<StepId, StepInfo> = {
  prepare: {
    objective: 'Select the unknown sample and biochemical test tubes.',
    instruction: 'Choose the unknown bacterial culture and the set of 5 biochemical test tubes.',
    actionLabel: 'Confirm Selection',
    helperText: 'Start with the correct sterile materials for accurate biochemical testing.',
  },
  inoculate: {
    objective: 'Inoculate each test tube with the unknown sample.',
    instruction: 'Use the inoculating loop to transfer the sample to each of the 5 test tubes.',
    actionLabel: 'Inoculate All Tubes',
    helperText: 'Each tube must be inoculated properly for reliable results.',
  },
  incubate: {
    objective: 'Incubate the test tubes to allow reactions to develop.',
    instruction: 'Submit the tubes for incubation and wait for the biochemical reactions to occur.',
    actionLabel: 'Submit for Incubation',
    helperText: 'Incubation time varies by test but 24-48 hours is typical.',
  },
  observe: {
    objective: 'Observe and record the reaction in each test tube.',
    instruction: 'Click each test tube to observe its reaction and record the result.',
    actionLabel: 'Record All Observations',
    helperText: 'Compare each reaction against the positive/negative reference.',
  },
  interpret: {
    objective: 'Identify the organism based on the biochemical profile.',
    instruction: 'Analyze the pattern of positive/negative results across all 5 tests.',
    actionLabel: 'Submit Interpretation',
    helperText: 'Identification is based on the full combination of test results, not any single test.',
  },
}

export const ORGANISM_OPTIONS: QuizOption[] = [
  {
    value: 'escherichia-coli',
    label: 'Escherichia coli',
  },
  {
    value: 'staphylococcus-aureus',
    label: 'Staphylococcus aureus',
  },
  {
    value: 'pseudomonas-aeruginosa',
    label: 'Pseudomonas aeruginosa',
  },
  {
    value: 'klebsiella-pneumoniae',
    label: 'Klebsiella pneumoniae',
  },
]

export const MISCONCEPTION_OPTIONS: QuizOption[] = [
  {
    value: 'yes-one-test',
    label: 'Yes, one clear positive test result is enough to identify the species',
  },
  {
    value: 'no-combination',
    label: 'No, identification requires looking at the full combination of test results',
  },
]

export type MistakeKind = 'wrong-item' | 'incomplete-inoculation' | 'misidentified'

export type Mistake = {
  step: StepId
  kind: MistakeKind
  message: string
  timestamp: number
}

export function buildMentorContext(
  step: StepId,
  phase: Phase,
  inoculationQuality: InoculationQuality | null,
  observedReactions: TestTubeId[],
  recentMistake: Mistake | null,
): string {
  const stepLabel = STEP_LABELS[step]
  const contextParts: string[] = [
    `The student is currently on the ${stepLabel} step (phase: ${phase}).`,
  ]

  if (step === 'inoculate' && inoculationQuality === null) {
    contextParts.push('They are about to inoculate the biochemical test tubes.')
  }

  if (inoculationQuality === 'incomplete') {
    contextParts.push('Their inoculation was incomplete, so some test results may be unreliable.')
  }

  if (step === 'observe') {
    contextParts.push(
      `They have observed ${observedReactions.length} of ${TEST_TUBES.length} test tube reactions.`,
    )
  }

  if (recentMistake) {
    contextParts.push(
      `Their most recent mistake was: ${recentMistake.message} (kind: ${recentMistake.kind}).`,
    )
  }

  if (phase === 'select') {
    contextParts.push('They need to select the correct item or action to proceed.')
  } else if (phase === 'inoculating') {
    contextParts.push('They are inoculating the test tubes with the unknown sample.')
  } else if (phase === 'incubating') {
    contextParts.push('They are waiting for the incubation timer to finish.')
  } else if (phase === 'observing') {
    contextParts.push('They are observing and recording the biochemical reactions.')
  } else if (phase === 'quiz') {
    contextParts.push(
      'They are interpreting the biochemical profile to identify the unknown organism.',
    )
  }

  return contextParts.join(' ')
}
