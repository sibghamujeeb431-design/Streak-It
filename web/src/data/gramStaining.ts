import { experiments } from './experiments'
import type { LabMode, QuizOption, StepInfo } from './labCommon'

export { type LabMode, type QuizOption, type StepInfo }

export const gramStainingExperiment = experiments.find((e) => e.slug === 'gram-staining')!

export type StepId =
  | 'prepare'
  | 'stain'
  | 'decolorize'
  | 'counterstain'
  | 'observe'
  | 'interpret'

export type ReagentId = 'crystal-violet' | 'iodine' | 'decolorizer' | 'safranin'

export type DecolorizationOutcome = 'under' | 'correct' | 'over' | null

export type DecolorizeStage = 'iodine' | 'decolorizer' | null

export type GramType = 'positive' | 'negative'

export type ObservedResult = 'purple' | 'pink' | null

export type Phase =
  | 'select'
  | 'apply'
  | 'wait'
  | 'rinse'
  | 'decolorize'
  | 'observe'
  | 'quiz'
  | 'done'

export const STEP_ORDER: StepId[] = [
  'prepare',
  'stain',
  'decolorize',
  'counterstain',
  'observe',
  'interpret',
]

export const STEP_LABELS: Record<StepId, string> = {
  prepare: 'Prepare',
  stain: 'Stain',
  decolorize: 'Decolorize',
  counterstain: 'Counterstain',
  observe: 'Observe',
  interpret: 'Interpret',
}

export type Reagent = {
  id: ReagentId
  name: string
  shortName: string
  role: string
  colorClass: string
  liquidColor: string
  glassTint?: string
  clear?: boolean
}

export const REAGENTS: Reagent[] = [
  {
    id: 'crystal-violet',
    name: 'Crystal Violet',
    shortName: 'CV',
    role: 'Primary stain',
    colorClass: 'bg-purple-600',
    liquidColor: '#5B21B6',
  },
  {
    id: 'iodine',
    name: "Gram's Iodine",
    shortName: 'Iodine',
    role: 'Mordant / fixing reagent',
    colorClass: 'bg-amber-700',
    liquidColor: '#3B1A78',
    glassTint: '#8A5A22',
  },
  {
    id: 'decolorizer',
    name: 'Decolorizer',
    shortName: 'Decolorizer',
    role: 'Removes stain from some cells',
    colorClass: 'bg-slate-200',
    liquidColor: '#8A7FB0',
    clear: true,
  },
  {
    id: 'safranin',
    name: 'Safranin',
    shortName: 'Safranin',
    role: 'Counterstain',
    colorClass: 'bg-red-500',
    liquidColor: '#B4344A',
  },
]

export function getReagent(id: ReagentId): Reagent {
  return REAGENTS.find((r) => r.id === id)!
}

export const STAIN_DURATION_MS = 2000
export const DECOLORIZE_MAX_MS = 8000
export const DECOLORIZE_UNDER_MS = 2000
export const DECOLORIZE_OVER_MS = 5000
export const TICK_MS = 100

export const STEP_INFO: Record<StepId, StepInfo> = {
  prepare: {
    objective: 'Select the prepared slide to begin the protocol.',
    instruction: 'Choose a fixed bacterial smear on a glass slide.',
    actionLabel: 'Select Slide',
    helperText: 'A prepared slide is ready on the bench.',
  },
  stain: {
    objective: 'Apply the primary stain to the smear.',
    instruction: 'Choose Crystal Violet and let it sit for the full time.',
    actionLabel: 'Apply Stain',
    helperText: 'The primary stain colors all cells initially.',
  },
  decolorize: {
    objective: 'Fix the stain, then carefully decolorize.',
    instruction: 'Apply iodine, rinse, then use the decolorizer for 2–5 seconds.',
    actionLabel: 'Add Decolorizer',
    helperText: 'Decolorization is the most critical step.',
  },
  counterstain: {
    objective: 'Apply the counterstain to reveal any decolorized cells.',
    instruction: 'Choose Safranin and let it sit before rinsing.',
    actionLabel: 'Add Counterstain',
    helperText: 'Safranin colors cells that lost the primary stain.',
  },
  observe: {
    objective: 'Examine the slide under the microscope.',
    instruction: 'Switch to the microscope view and record what you see.',
    actionLabel: 'Switch to Microscope',
    helperText: 'Purple/violet suggests Gram-positive; pink/red suggests Gram-negative.',
  },
  interpret: {
    objective: 'Classify the result and explain your reasoning.',
    instruction: 'Answer both questions based on your observation.',
    actionLabel: 'Submit Interpretation',
    helperText: 'Your score is based on what you actually observed.',
  },
}

export const REACTION_OPTIONS: QuizOption[] = [
  { value: 'gram-positive', label: 'Gram-positive reaction (purple/violet)' },
  { value: 'gram-negative', label: 'Gram-negative reaction (pink/red)' },
]

export const REASONING_OPTIONS: QuizOption[] = [
  {
    value: 'thick-peptidoglycan',
    label: 'Thick peptidoglycan layer retained the crystal violet–iodine complex.',
  },
  {
    value: 'thin-peptidoglycan',
    label: 'Thin peptidoglycan layer allowed decolorization, then safranin entered.',
  },
  {
    value: 'over-decolorized',
    label: 'The Gram-positive sample was over-decolorized, so it lost the primary stain.',
  },
  {
    value: 'under-decolorized',
    label: 'The Gram-negative sample was under-decolorized, so it kept the primary stain.',
  },
]

export type MistakeKind = 'wrong-reagent' | 'wrong-order' | 'repeat-mistake'

export type Mistake = {
  step: StepId
  kind: MistakeKind
  message: string
  timestamp: number
}

export function buildMentorContext(
  step: StepId,
  phase: Phase,
  recentMistake: Mistake | null,
  trueGramType: GramType,
): string {
  const stepLabel = STEP_LABELS[step]
  const contextParts: string[] = [
    `The student is currently on the ${stepLabel} step (phase: ${phase}).`,
    `This run uses a fixed ${trueGramType} sample.`,
  ]

  if (recentMistake) {
    contextParts.push(
      `Their most recent mistake was: ${recentMistake.message} (kind: ${recentMistake.kind}).`,
    )
  }

  if (phase === 'select') {
    contextParts.push('They need to select the correct item or reagent to proceed.')
  } else if (phase === 'apply') {
    contextParts.push('They need to apply the chosen reagent.')
  } else if (phase === 'wait') {
    contextParts.push('They are waiting for a timer to finish.')
  } else if (phase === 'decolorize') {
    contextParts.push(
      'They are performing the decolorization step. Under 2 seconds is under-decolorized, 2–5 seconds is correct, over 5 seconds is over-decolorized.',
    )
  } else if (phase === 'quiz') {
    contextParts.push('They are answering the interpretation quiz.')
  }

  return contextParts.join(' ')
}
