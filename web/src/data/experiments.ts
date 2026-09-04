export interface Experiment {
  id: string
  slug: string
  title: string
  shortName: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  time: string
  steps: string[]
}

export const experiments: Experiment[] = [
  {
    id: 'gram-staining',
    slug: 'gram-staining',
    title: 'Gram Staining',
    shortName: 'Gram Staining',
    description:
      'Classify bacteria into Gram-positive and Gram-negative groups using crystal violet, iodine, alcohol, and safranin.',
    difficulty: 'Beginner',
    time: '15 min',
    steps: ['Prepare', 'Stain', 'Decolorize', 'Counterstain', 'Observe', 'Interpret'],
  },
  {
    id: 'streak-plate',
    slug: 'streak-plate',
    title: 'Streak Plate Method',
    shortName: 'Streak Plate',
    description:
      'Isolate a pure bacterial colony from a mixed culture using the quadrant streaking technique.',
    difficulty: 'Beginner',
    time: '20 min',
    steps: ['Prepare', 'Streak', 'Incubate', 'Observe', 'Interpret'],
  },
  {
    id: 'ast',
    slug: 'ast',
    title: 'Antimicrobial Susceptibility Test',
    shortName: 'AST',
    description:
      'Determine how effective different antibiotics are against a bacterial strain using disc diffusion.',
    difficulty: 'Intermediate',
    time: '25 min',
    steps: ['Prepare', 'Inoculate', 'Place Discs', 'Incubate', 'Interpret'],
  },
  {
    id: 'serial-dilution',
    slug: 'serial-dilution',
    title: 'Serial Dilution & Pour Plate',
    shortName: 'Serial Dilution',
    description:
      'Dilute a bacterial sample across tubes and pour onto plates to estimate viable cell counts.',
    difficulty: 'Intermediate',
    time: '30 min',
    steps: ['Prepare', 'Dilute', 'Pour Plate', 'Incubate', 'Interpret'],
  },
  {
    id: 'biochemical-testing',
    slug: 'biochemical-testing',
    title: 'Biochemical Testing',
    shortName: 'Biochemical Testing',
    description:
      'Identify an unknown microbe by testing its metabolic reactions across multiple media.',
    difficulty: 'Advanced',
    time: '35 min',
    steps: ['Prepare', 'Inoculate', 'Incubate', 'Observe Reactions', 'Interpret'],
  },
]

export function getExperimentBySlug(slug: string): Experiment | undefined {
  return experiments.find((e) => e.slug === slug)
}
