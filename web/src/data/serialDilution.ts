import { experiments } from './experiments'
import type { BenchItem, QuizOption, StepInfo } from './labCommon'

export { type BenchItem, type QuizOption, type StepInfo }

export const serialDilutionExperiment = experiments.find((e) => e.slug === 'serial-dilution')!

export type StepId = 'prepare' | 'dilute' | 'pour-plate' | 'incubate' | 'interpret'

export const STEP_ORDER: StepId[] = [
  'prepare',
  'dilute',
  'pour-plate',
  'incubate',
  'interpret',
]

export const STEP_LABELS: Record<StepId, string> = {
  prepare: 'Prepare',
  dilute: 'Dilute',
  'pour-plate': 'Pour Plate',
  incubate: 'Incubate',
  interpret: 'Interpret',
}

export type Phase =
  | 'select'
  | 'transferring'
  | 'mixing'
  | 'incubating'
  | 'observe'
  | 'quiz'
  | 'done'

export const PHASE: Record<string, Phase> = {
  select: 'select',
  transferring: 'transferring',
  mixing: 'mixing',
  incubating: 'incubating',
  observe: 'observe',
  quiz: 'quiz',
  done: 'done',
}

export type DilutionTubeId = '10^-1' | '10^-2' | '10^-3' | '10^-4' | '10^-5'

export const DILUTION_TUBES: DilutionTubeId[] = ['10^-1', '10^-2', '10^-3', '10^-4', '10^-5']

export type DilutionAccuracy = 'correct' | 'inconsistent'

export type DilutionChoice = 'optimal' | 'too_concentrated' | 'too_dilute'

export type PlateResult = {
  countable: boolean
  colonyCount: number | null
  visualState: 'optimal' | 'overcrowded' | 'sparse' | 'inconsistent'
}

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
    id: 'dilution-tubes',
    name: 'Dilution Series Tubes',
    kind: 'tubes',
    correct: true,
    sterile: true,
    image: '/images/lab/streak-plate/agar-plate.png',
  },
  {
    id: 'contaminated-tubes',
    name: 'Contaminated Tubes',
    kind: 'tubes',
    correct: false,
    sterile: false,
    image: '/images/lab/streak-plate/agar-plate.png',
  },
  {
    id: 'micropipette',
    name: 'Micropipette',
    kind: 'tool',
    correct: true,
    sterile: true,
    image: '/images/lab/streak-plate/inoculation-loop.png',
  },
  {
    id: 'petri-dish',
    name: 'Petri Dish with Molten Agar',
    kind: 'plate',
    correct: true,
    sterile: true,
    image: '/images/lab/streak-plate/agar-plate.png',
  },
]

export const CORRECT_ITEM_IDS = new Set(
  BENCH_ITEMS.filter((item) => item.correct).map((item) => item.id),
)

export const TRANSFER_MS = 1500
export const MIX_MS = 1000
export const INCUBATE_MS = 3000
export const TICK_MS = 100

export const STEP_INFO: Record<StepId, StepInfo> = {
  prepare: {
    objective: 'Select your original sample and dilution series tubes.',
    instruction: 'Choose the bacterial sample and the set of sterile dilution tubes.',
    actionLabel: 'Select Sample',
    helperText: 'Proper materials are essential for accurate serial dilution.',
  },
  dilute: {
    objective: 'Perform serial dilution by transferring and mixing sample progressively.',
    instruction: 'Use the micropipette to transfer sample through each dilution tube, mixing thoroughly.',
    actionLabel: 'Transfer Sample',
    helperText: 'Consistent transfer volume and thorough mixing are critical for accuracy.',
  },
  'pour-plate': {
    objective: 'Select one dilution tube to pour into a plate with molten agar.',
    instruction: 'Choose a dilution that will yield countable colonies (30-300 colonies).',
    actionLabel: 'Pour Dilution',
    helperText: 'Too concentrated = uncountable lawn; too dilute = too few colonies.',
  },
  incubate: {
    objective: 'Incubate the plate to allow colonies to grow.',
    instruction: 'Submit the plate for incubation and wait for growth.',
    actionLabel: 'Submit for Incubation',
    helperText: 'Colonies need time to become visible for counting.',
  },
  interpret: {
    objective: 'Evaluate the plate and estimate the original cell concentration.',
    instruction: 'Determine if the plate is countable, estimate CFU/mL, and answer the misconception question.',
    actionLabel: 'Submit Interpretation',
    helperText: 'Your score is based on countability assessment and CFU calculation accuracy.',
  },
}

export const COUNTABILITY_OPTIONS: QuizOption[] = [
  {
    value: 'yes-countable',
    label: 'Yes, colonies are clearly countable',
  },
  {
    value: 'no-crowded',
    label: 'No, too crowded to count',
  },
  {
    value: 'no-few',
    label: 'No, too few colonies present',
  },
]

export function generateCFUOptions(dilutionTube: DilutionTubeId, colonyCount: number): QuizOption[] {
  const dilutionFactor = parseInt(dilutionTube.replace('10^-', ''))
  const correctCFU = colonyCount * Math.pow(10, dilutionFactor)
  
  // Generate plausible options around the correct value
  const options = [
    { value: correctCFU.toString(), label: `${correctCFU.toLocaleString()} CFU/mL` },
    { value: (correctCFU / 10).toString(), label: `${(correctCFU / 10).toLocaleString()} CFU/mL` },
    { value: (correctCFU * 10).toString(), label: `${(correctCFU * 10).toLocaleString()} CFU/mL` },
    { value: (correctCFU * 100).toString(), label: `${(correctCFU * 100).toLocaleString()} CFU/mL` },
  ]
  
  // Shuffle options so correct answer isn't always first
  return options.sort(() => Math.random() - 0.5)
}

export const MISCONCEPTION_OPTIONS: QuizOption[] = [
  {
    value: 'yes-exactly-one',
    label: 'Yes, always exactly one cell',
  },
  {
    value: 'no-clump-or-cells',
    label: 'No, a colony can arise from more than one cell or a clump',
  },
]

export type MistakeKind =
  | 'wrong-item'
  | 'inconsistent-transfer'
  | 'skipped-mixing'
  | 'poor-dilution-choice'

export type Mistake = {
  step: StepId
  kind: MistakeKind
  message: string
  timestamp: number
}

export function buildMentorContext(
  step: StepId,
  phase: Phase,
  dilutionAccuracy: DilutionAccuracy | null,
  dilutionChoice: DilutionChoice | null,
  recentMistake: Mistake | null,
): string {
  const stepLabel = STEP_LABELS[step]
  const contextParts: string[] = [
    `The student is currently on the ${stepLabel} step (phase: ${phase}).`,
  ]

  if (step === 'dilute' && dilutionAccuracy !== null) {
    contextParts.push(
      `Their dilution technique has been ${dilutionAccuracy === 'correct' ? 'consistent and accurate' : 'inconsistent'}.`,
    )
  }

  if (step === 'pour-plate' && dilutionChoice !== null) {
    contextParts.push(
      `They chose a ${dilutionChoice} dilution for the pour plate.`,
    )
  }

  if (recentMistake) {
    contextParts.push(
      `Their most recent mistake was: ${recentMistake.message} (kind: ${recentMistake.kind}).`,
    )
  }

  if (phase === 'select') {
    contextParts.push('They need to select the correct item or action to proceed.')
  } else if (phase === 'transferring') {
    contextParts.push('They are transferring sample between dilution tubes.')
  } else if (phase === 'mixing') {
    contextParts.push('They are mixing the dilution to ensure uniform distribution.')
  } else if (phase === 'incubating') {
    contextParts.push('They are waiting for the incubation timer to finish.')
  } else if (phase === 'observe') {
    contextParts.push('They need to observe the plate and assess countability.')
  } else if (phase === 'quiz') {
    contextParts.push('They are answering the interpretation quiz about countability and CFU estimation.')
  }

  return contextParts.join(' ')
}
