import type {
  InoculationQuality,
  Mistake,
  ReactionResult,
} from '../data/biochemicalTesting'
import { ORGANISM_PROFILE, TEST_TUBES } from '../data/biochemicalTesting'
import { combineScore, type ScoreBreakdown } from './scoring'

export type { ScoreBreakdown }

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

export function computeDecisionScore(
  inoculationQuality: InoculationQuality,
): number {
  return inoculationQuality === 'correct' ? 100 : 40
}

export function computeInterpretationScore(
  observedReactions: ReactionResult[],
  organismAnswer: string | null,
  misconceptionAnswer: string | null,
): number {
  let score = 0

  // Check if the organism identification matches the profile
  // The correct answer is 'escherichia-coli' which matches the fixed profile
  if (organismAnswer === 'escherichia-coli') {
    // Bonus if observed reactions actually match the profile
    const allMatch = observedReactions.every((r) => {
      const expected = ORGANISM_PROFILE[r.tubeId]
      return r.result === expected
    })
    if (allMatch) {
      score += 60
    } else {
      score += 30 // Partial credit if reactions don't match
    }
  }

  // Check misconception about one-test identification
  if (misconceptionAnswer === 'no-combination') {
    score += 40
  }

  return score
}

export function computeScore(
  inoculationQuality: InoculationQuality,
  mistakes: Mistake[],
  observedReactions: ReactionResult[],
  organismAnswer: string | null,
  misconceptionAnswer: string | null,
): ScoreBreakdown {
  const procedural = computeProceduralScore(mistakes)
  const decision = computeDecisionScore(inoculationQuality)
  const interpretation = computeInterpretationScore(
    observedReactions,
    organismAnswer,
    misconceptionAnswer,
  )

  return combineScore(procedural, decision, interpretation)
}

export function getTestTubeResults(
  inoculationQuality: InoculationQuality,
): ReactionResult[] {
  return TEST_TUBES.map((tubeId) => {
    let result: 'positive' | 'negative' | 'ambiguous'
    if (inoculationQuality === 'incomplete') {
      result = 'ambiguous'
    } else {
      result = ORGANISM_PROFILE[tubeId]
    }
    return { tubeId, result, observed: false }
  })
}
