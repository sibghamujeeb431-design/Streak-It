import type {
  AntibioticDisc,
  DiscId,
  InoculationQuality,
  Mistake,
} from '../data/ast'
import { DISCS, getDisc, measuredZoneMm } from '../data/ast'
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
  return inoculationQuality === 'even' ? 100 : 40
}

export function computeInterpretationScore(
  classificationAnswer: string | null,
  misconceptionAnswer: string | null,
): number {
  let score = 0

  // Gentamicin's true zone stays above the susceptible breakpoint even when
  // an uneven lawn shrinks the measured diameter.
  if (classificationAnswer === 'susceptible') {
    score += 60
  }

  if (misconceptionAnswer === 'no-standardized-criteria') {
    score += 40
  }

  return score
}

export function computeScore(
  inoculationQuality: InoculationQuality,
  mistakes: Mistake[],
  classificationAnswer: string | null,
  misconceptionAnswer: string | null,
): ScoreBreakdown {
  const procedural = computeProceduralScore(mistakes)
  const decision = computeDecisionScore(inoculationQuality)
  const interpretation = computeInterpretationScore(
    classificationAnswer,
    misconceptionAnswer,
  )

  return combineScore(procedural, decision, interpretation)
}

export function getMeasuredZones(
  placedDiscs: DiscId[],
  quality: InoculationQuality,
): { disc: AntibioticDisc; zoneMm: number }[] {
  return placedDiscs.map((id) => {
    const disc = getDisc(id)
    return { disc, zoneMm: measuredZoneMm(disc, quality) }
  })
}

export function getAllDiscZones(
  quality: InoculationQuality,
): { disc: AntibioticDisc; zoneMm: number }[] {
  return DISCS.map((disc) => ({ disc, zoneMm: measuredZoneMm(disc, quality) }))
}
