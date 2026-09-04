import type { ExperimentAttempt } from '../lib/supabase'

export type SkillLabel = string

export type SkillMapping = {
  procedural: SkillLabel
  decision: SkillLabel
  interpretation: SkillLabel
}

export const EXPERIMENT_SKILL_MAP: Record<string, SkillMapping> = {
  'Gram Staining': {
    procedural: 'Staining Techniques',
    decision: 'Microscopy',
    interpretation: 'Data Interpretation',
  },
  'Streak Plate Method': {
    procedural: 'Aseptic Methods',
    decision: 'Colony Isolation',
    interpretation: 'Data Interpretation',
  },
  'Antimicrobial Susceptibility Test': {
    procedural: 'Susceptibility Testing',
    decision: 'Aseptic Methods',
    interpretation: 'Data Interpretation',
  },
}

export const ALL_SKILL_LABELS: SkillLabel[] = [
  'Staining Techniques',
  'Microscopy',
  'Aseptic Methods',
  'Colony Isolation',
  'Susceptibility Testing',
  'Data Interpretation',
]

export function getSkillLabels(experimentName: string): SkillMapping {
  return (
    EXPERIMENT_SKILL_MAP[experimentName] ?? {
      procedural: 'Procedural Skills',
      decision: 'Decision Making',
      interpretation: 'Data Interpretation',
    }
  )
}

export function computeSkillAverages(
  attempts: ExperimentAttempt[],
): Record<SkillLabel, number> {
  const sums = new Map<SkillLabel, { sum: number; count: number }>()

  for (const attempt of attempts) {
    const labels = getSkillLabels(attempt.experiment_name)
    const entries: [keyof SkillMapping, keyof Pick<
      ExperimentAttempt,
      'procedural_accuracy' | 'decision_accuracy' | 'interpretation_accuracy'
    >][] = [
      ['procedural', 'procedural_accuracy'],
      ['decision', 'decision_accuracy'],
      ['interpretation', 'interpretation_accuracy'],
    ]

    for (const [kind, column] of entries) {
      const label = labels[kind]
      const score = attempt[column]
      const current = sums.get(label) ?? { sum: 0, count: 0 }
      current.sum += score
      current.count += 1
      sums.set(label, current)
    }
  }

  const result: Record<SkillLabel, number> = {}
  for (const label of ALL_SKILL_LABELS) {
    const aggregate = sums.get(label)
    result[label] = aggregate ? Math.round(aggregate.sum / aggregate.count) : 0
  }
  return result
}
