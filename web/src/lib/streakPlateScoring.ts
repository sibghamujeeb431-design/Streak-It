import type {
  Mistake,
  StreakRegion,
  StreakingOutcome,
} from '../data/streakPlate'
import { combineScore, type ScoreBreakdown } from './scoring'

export type { ScoreBreakdown }

export function resolveStreakingOutcome(
  regions: StreakRegion[],
  contaminated: boolean,
): StreakingOutcome {
  if (contaminated) return 'contaminated'

  const streakedCount = regions.filter((r) => r.streaked).length
  if (streakedCount < regions.length) return 'ineffective_pattern'

  const hasHeavyCarryover = regions.some((r) => r.carryover === 'heavy')
  if (hasHeavyCarryover) return 'poor_separation'

  return 'correct'
}

export function computeProceduralScore(mistakes: Mistake[]): number {
  let score = 100
  const seen = new Set<string>()

  for (const mistake of mistakes) {
    const key = `${mistake.step}:${mistake.kind}`
    if (seen.has(key)) {
      score -= 10
    } else {
      seen.add(key)
      score -= 15
    }
  }

  return Math.max(0, score)
}

export function computeDecisionScore(outcome: StreakingOutcome): number {
  switch (outcome) {
    case 'correct':
      return 100
    case 'ineffective_pattern':
      return 50
    case 'poor_separation':
      return 40
    case 'contaminated':
      return 0
    default:
      return 0
  }
}

export function computeInterpretationScore(
  outcome: StreakingOutcome,
  resultAnswer: string | null,
  reasoningAnswer: string | null,
): number {
  let score = 0

  const resultMapping: Record<StreakingOutcome, string> = {
    correct: 'yes-isolated',
    poor_separation: 'no-crowded',
    ineffective_pattern: 'no-crowded',
    contaminated: 'contaminated',
  }

  if (resultAnswer === resultMapping[outcome]) {
    score += 60
  }

  const reasoningMapping: Record<StreakingOutcome, string> = {
    correct: 'progressive-dilution',
    poor_separation: 'too-much-carryover',
    ineffective_pattern: 'inconsistent-technique',
    contaminated: 'inconsistent-technique',
  }

  if (reasoningAnswer === reasoningMapping[outcome]) {
    score += 40
  }

  return score
}

export function computeScore(
  regions: StreakRegion[],
  contaminated: boolean,
  mistakes: Mistake[],
  resultAnswer: string | null,
  reasoningAnswer: string | null,
): ScoreBreakdown {
  const outcome = resolveStreakingOutcome(regions, contaminated)
  const procedural = computeProceduralScore(mistakes)
  const decision = computeDecisionScore(outcome)
  const interpretation = computeInterpretationScore(
    outcome,
    resultAnswer,
    reasoningAnswer,
  )

  return combineScore(procedural, decision, interpretation)
}
