import { experiments } from './experiments'
import type { BenchItem, QuizOption, StepInfo } from './labCommon'

export { type BenchItem, type QuizOption, type StepInfo }

export const astExperiment = experiments.find((e) => e.slug === 'ast')!

export type StepId = 'prepare' | 'inoculate' | 'discs' | 'incubate' | 'interpret'

export const STEP_ORDER: StepId[] = [
  'prepare',
  'inoculate',
  'discs',
  'incubate',
  'interpret',
]

export const STEP_LABELS: Record<StepId, string> = {
  prepare: 'Prepare',
  inoculate: 'Inoculate',
  discs: 'Place Discs',
  incubate: 'Incubate',
  interpret: 'Interpret',
}

export type Phase =
  | 'select'
  | 'incubating'
  | 'quiz'
  | 'done'

export const BENCH_ITEMS: BenchItem[] = [
  {
    id: 'bacterial-sample',
    name: 'Bacterial Sample',
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
    id: 'mha-plate',
    name: 'Mueller-Hinton Agar Plate',
    kind: 'plate',
    correct: true,
    sterile: true,
    subtitle: 'Growth medium',
    image: '/images/lab/ast/agar-plate.png',
  },
  {
    id: 'used-plate',
    name: 'Used Agar Plate',
    kind: 'plate',
    correct: false,
    sterile: false,
    subtitle: 'Growth medium',
    image: '/images/lab/ast/agar-plate.png',
  },
  {
    id: 'sterile-swab',
    name: 'Sterile Cotton Swab',
    kind: 'swab',
    correct: true,
    sterile: true,
    subtitle: 'Inoculation tool',
    image: '/images/lab/ast/swab.png',
  },
  {
    id: 'used-swab',
    name: 'Used Cotton Swab',
    kind: 'swab',
    correct: false,
    sterile: false,
    subtitle: 'Inoculation tool',
    image: '/images/lab/ast/swab.png',
  },
]

export const CORRECT_ITEM_IDS = new Set(
  BENCH_ITEMS.filter((item) => item.correct).map((item) => item.id),
)

export type InoculationQuality = 'even' | 'uneven'

export type InoculationTechnique = 'even-lawn' | 'quick-swipe'

export type DiscId = 'amc' | 'gen' | 'cip' | 'te' | 'sxt'

export type ZoneClassification = 'susceptible' | 'intermediate' | 'resistant'

export type AntibioticDisc = {
  id: DiscId
  code: string
  name: string
  zoneMm: number
  classification: ZoneClassification
}

export const DISCS: AntibioticDisc[] = [
  {
    id: 'amc',
    code: 'AMC 30',
    name: 'Amoxicillin 30 µg',
    zoneMm: 12,
    classification: 'resistant',
  },
  {
    id: 'gen',
    code: 'GEN 10',
    name: 'Gentamicin 10 µg',
    zoneMm: 21,
    classification: 'susceptible',
  },
  {
    id: 'cip',
    code: 'CIP 5',
    name: 'Ciprofloxacin 5 µg',
    zoneMm: 28,
    classification: 'susceptible',
  },
  {
    id: 'te',
    code: 'TE 30',
    name: 'Tetracycline 30 µg',
    zoneMm: 15,
    classification: 'intermediate',
  },
  {
    id: 'sxt',
    code: 'SXT 25',
    name: 'Trimethoprim/Sulfamethoxazole 25 µg',
    zoneMm: 24,
    classification: 'susceptible',
  },
]

export const MIN_DISCS = 3
export const MAX_DISCS = 5

export function getDisc(id: DiscId): AntibioticDisc {
  return DISCS.find((d) => d.id === id)!
}

// Standardized teaching breakpoints for Gentamicin 10 µg discs.
export const GEN_BREAKPOINTS = {
  susceptibleMinMm: 16,
  intermediateMinMm: 13,
} as const

export function measuredZoneMm(
  disc: AntibioticDisc,
  quality: InoculationQuality,
): number {
  if (quality === 'even') return disc.zoneMm
  const factor = 0.8 + DISCS.indexOf(disc) * 0.03
  return Math.round(disc.zoneMm * factor)
}

export const INCUBATE_MS = 3000
export const TICK_MS = 100

export const STEP_INFO: Record<StepId, StepInfo> = {
  prepare: {
    objective: 'Gather the correct sterile materials.',
    instruction:
      'Choose the bacterial sample, a sterile Mueller-Hinton agar plate, and a sterile swab.',
    actionLabel: 'Confirm Selection',
    helperText: 'Standardized testing starts with the right materials.',
  },
  inoculate: {
    objective: 'Spread an even lawn of bacteria across the plate.',
    instruction: 'Swab the whole surface in multiple directions for a uniform lawn.',
    actionLabel: 'Inoculate Plate',
    helperText: 'An even lawn keeps zone edges sharp and measurable.',
  },
  discs: {
    objective: 'Place antibiotic discs onto the inoculated lawn.',
    instruction: 'Select at least 3 discs and space them across the plate.',
    actionLabel: 'Place Discs',
    helperText: 'Zones that overlap cannot be measured accurately.',
  },
  incubate: {
    objective: 'Incubate the plate so the drugs can diffuse.',
    instruction: 'Submit the plate for incubation and wait for the zones to form.',
    actionLabel: 'Submit for Incubation',
    helperText: 'Drug diffusion and bacterial growth happen together.',
  },
  interpret: {
    objective: 'Measure the zones and classify the response.',
    instruction: 'Compare each zone diameter with the standardized breakpoints.',
    actionLabel: 'Switch to Plate View',
    helperText: 'Judge each drug against its own criteria, not against other zones.',
  },
}

export const CLASSIFICATION_OPTIONS: QuizOption[] = [
  { value: 'susceptible', label: 'Susceptible' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'resistant', label: 'Resistant' },
]

export const MISCONCEPTION_OPTIONS: QuizOption[] = [
  {
    value: 'yes-bigger-stronger',
    label: 'Yes, bigger always means stronger',
  },
  {
    value: 'no-standardized-criteria',
    label:
      'No, it depends on standardized interpretation criteria for that specific drug and organism',
  },
]

export type MistakeKind = 'wrong-item' | 'uneven-inoculation'

export type Mistake = {
  step: StepId
  kind: MistakeKind
  message: string
  timestamp: number
}

export function buildMentorContext(
  step: StepId,
  phase: Phase,
  technique: InoculationTechnique,
  inoculationQuality: InoculationQuality | null,
  placedDiscs: DiscId[],
  recentMistake: Mistake | null,
): string {
  const stepLabel = STEP_LABELS[step]
  const contextParts: string[] = [
    `The student is currently on the ${stepLabel} step (phase: ${phase}).`,
  ]

  if (step === 'inoculate' && inoculationQuality === null) {
    contextParts.push(
      technique === 'quick-swipe'
        ? 'They have selected the quick-swipe technique, which will give an uneven lawn.'
        : 'They have selected the even-lawn technique.',
    )
  }

  if (step === 'discs') {
    contextParts.push(
      `They have placed ${placedDiscs.length} of at least ${MIN_DISCS} required antibiotic discs (maximum ${MAX_DISCS}).`,
    )
  }

  if (inoculationQuality === 'uneven') {
    contextParts.push('Their plate was inoculated unevenly, so zone edges will be distorted.')
  }

  if (recentMistake) {
    contextParts.push(
      `Their most recent mistake was: ${recentMistake.message} (kind: ${recentMistake.kind}).`,
    )
  }

  if (phase === 'select') {
    contextParts.push('They need to select the correct item or action to proceed.')
  } else if (phase === 'incubating') {
    contextParts.push('They are waiting for the incubation timer to finish.')
  } else if (phase === 'quiz') {
    contextParts.push(
      'They are interpreting the plate: Gentamicin zone classification and zone-size interpretation.',
    )
  }

  return contextParts.join(' ')
}
