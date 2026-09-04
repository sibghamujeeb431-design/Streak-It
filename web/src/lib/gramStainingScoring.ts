import type {
  DecolorizationOutcome,
  GramType,
  Mistake,
  ObservedResult,
} from '../data/gramStaining'
import { combineScore, type ScoreBreakdown } from './scoring'

export type { ScoreBreakdown }

export function resolveObservedResult(
  trueGramType: GramType,
  decolorizationOutcome: DecolorizationOutcome,
): ObservedResult {
  if (!decolorizationOutcome) return null

  if (trueGramType === 'positive') {
    // Over-decolorization strips the primary stain from Gram-positive cells.
    return decolorizationOutcome === 'over' ? 'pink' : 'purple'
  }

  // For Gram-negative, under-decolorization keeps the primary stain.
  return decolorizationOutcome === 'under' ? 'purple' : 'pink'
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

export function computeDecisionScore(
  decolorizationOutcome: DecolorizationOutcome,
): number {
  switch (decolorizationOutcome) {
    case 'correct':
      return 100
    case 'under':
      return 50
    case 'over':
      return 40
    default:
      return 0
  }
}

export function computeInterpretationScore(
  observedResult: ObservedResult,
  trueGramType: GramType,
  decolorizationOutcome: DecolorizationOutcome,
  reactionAnswer: string | null,
  reasoningAnswer: string | null,
): number {
  let score = 0

  // Reaction matches observed color.
  if (observedResult === 'purple' && reactionAnswer === 'gram-positive') {
    score += 60
  } else if (observedResult === 'pink' && reactionAnswer === 'gram-negative') {
    score += 60
  }

  // Reasoning matches true biology + actual outcome.
  if (trueGramType === 'positive') {
    if (decolorizationOutcome === 'over') {
      if (reasoningAnswer === 'over-decolorized') score += 40
    } else {
      if (reasoningAnswer === 'thick-peptidoglycan') score += 40
    }
  } else {
    if (decolorizationOutcome === 'under') {
      if (reasoningAnswer === 'under-decolorized') score += 40
    } else {
      if (reasoningAnswer === 'thin-peptidoglycan') score += 40
    }
  }

  return score
}

export function computeScore(
  trueGramType: GramType,
  mistakes: Mistake[],
  decolorizationOutcome: DecolorizationOutcome,
  reactionAnswer: string | null,
  reasoningAnswer: string | null,
): ScoreBreakdown {
  const procedural = computeProceduralScore(mistakes)
  const decision = computeDecisionScore(decolorizationOutcome)
  const observedResult = resolveObservedResult(trueGramType, decolorizationOutcome)
  const interpretation = computeInterpretationScore(
    observedResult,
    trueGramType,
    decolorizationOutcome,
    reactionAnswer,
    reasoningAnswer,
  )

  return combineScore(procedural, decision, interpretation)
}
