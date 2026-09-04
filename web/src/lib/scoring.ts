export type ScoreBreakdown = {
  procedural: number
  decision: number
  interpretation: number
  overall: number
}

export function combineScore(
  procedural: number,
  decision: number,
  interpretation: number,
): ScoreBreakdown {
  const overall = Math.round(procedural * 0.4 + decision * 0.3 + interpretation * 0.3)

  return {
    procedural,
    decision,
    interpretation,
    overall: Math.max(0, Math.min(100, overall)),
  }
}
