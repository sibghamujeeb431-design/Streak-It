import type {
  DilutionChoice,
  Mistake,
  PlateResult,
} from '../data/serialDilution'
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

export function computeDecisionScore(dilutionChoice: DilutionChoice): number {
  switch (dilutionChoice) {
    case 'optimal':
      return 100
    case 'too_concentrated':
      return 40
    case 'too_dilute':
      return 40
    default:
      return 0
  }
}

export function computeInterpretationScore(
  plateResult: PlateResult,
  countabilityAnswer: string | null,
  cfuEstimateAnswer: string | null,
  misconceptionAnswer: string | null,
  selectedDilutionTube: string | null,
): number {
  let score = 0

  // Countability assessment (40% of interpretation score)
  if (plateResult.countable && countabilityAnswer === 'yes-countable') {
    score += 40
  } else if (!plateResult.countable) {
    if (plateResult.visualState === 'overcrowded' && countabilityAnswer === 'no-crowded') {
      score += 40
    } else if (plateResult.visualState === 'sparse' && countabilityAnswer === 'no-few') {
      score += 40
    } else if (plateResult.visualState === 'inconsistent' && countabilityAnswer === 'no-crowded') {
      score += 40
    }
  }

  // CFU estimation (40% of interpretation score) - only applicable if countable
  if (plateResult.countable && plateResult.colonyCount !== null && cfuEstimateAnswer !== null && selectedDilutionTube) {
    // Calculate the correct CFU
    const dilutionFactor = parseInt(selectedDilutionTube.replace('10^-', ''))
    const correctCFU = plateResult.colonyCount * Math.pow(10, dilutionFactor)
    const studentCFU = parseInt(cfuEstimateAnswer)
    
    // Check if the student's answer is correct (within a small margin for numerical precision)
    if (Math.abs(studentCFU - correctCFU) < correctCFU * 0.1) {
      score += 40
    }
  } else if (!plateResult.countable) {
    // If not countable, CFU estimation doesn't apply, so give full credit for skipping
    score += 40
  }

  // Misconception rejection (20% of interpretation score)
  if (misconceptionAnswer === 'no-clump-or-cells') {
    score += 20
  }

  return score
}

export function computeScore(
  mistakes: Mistake[],
  dilutionChoice: DilutionChoice,
  plateResult: PlateResult,
  countabilityAnswer: string | null,
  cfuEstimateAnswer: string | null,
  misconceptionAnswer: string | null,
  selectedDilutionTube: string | null,
): ScoreBreakdown {
  const procedural = computeProceduralScore(mistakes)
  const decision = computeDecisionScore(dilutionChoice)
  const interpretation = computeInterpretationScore(
    plateResult,
    countabilityAnswer,
    cfuEstimateAnswer,
    misconceptionAnswer,
    selectedDilutionTube,
  )

  return combineScore(procedural, decision, interpretation)
}
