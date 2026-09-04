import { CheckCircle2, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import type { LabMode } from '../../data/labCommon'
import type { ScoreBreakdown } from '../../lib/scoring'

interface ExperimentCompletedProps {
  score: ScoreBreakdown
  visual: ReactNode
  experimentName: string
  mode: LabMode
  onRetry: () => void
  onViewProgress: () => void
  onBackToExperiments: () => void
}

export function ExperimentCompleted({
  score,
  visual,
  experimentName,
  mode,
  onRetry,
  onViewProgress,
  onBackToExperiments,
}: ExperimentCompletedProps) {
  const headline =
    score.overall >= 85
      ? 'Excellent work!'
      : score.overall >= 55
        ? 'Good effort'
        : 'Keep practicing'

  return (
    <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-10 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal/10 flex items-center justify-center">
        <CheckCircle2 size={36} className="text-teal" />
      </div>

      <h2 className="text-2xl font-bold text-charcoal mb-2">{headline}</h2>
      <p className="text-stone mb-6">
        You completed the {experimentName} simulation in {mode === 'test' ? 'Test' : 'Learn'} mode.
      </p>

      <div className="flex justify-center mb-8">{visual}</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-card border border-stone/10 p-4">
          <p className="text-2xl font-bold text-charcoal">{score.overall}%</p>
          <p className="text-xs text-stone uppercase tracking-wide">Overall</p>
        </div>
        <div className="bg-white rounded-card border border-stone/10 p-4">
          <p className="text-2xl font-bold text-charcoal">{score.procedural}%</p>
          <p className="text-xs text-stone uppercase tracking-wide">Procedural</p>
        </div>
        <div className="bg-white rounded-card border border-stone/10 p-4">
          <p className="text-2xl font-bold text-charcoal">{score.decision}%</p>
          <p className="text-xs text-stone uppercase tracking-wide">Decision</p>
        </div>
        <div className="bg-white rounded-card border border-stone/10 p-4">
          <p className="text-2xl font-bold text-charcoal">{score.interpretation}%</p>
          <p className="text-xs text-stone uppercase tracking-wide">Interpretation</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onViewProgress}
          className="w-full sm:w-auto px-6 py-3 bg-coral hover:bg-coral/90 text-white font-medium rounded-button transition-colors"
        >
          View Detailed Results in Progress
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-3 bg-[#FDFBF7] border border-stone/15 hover:bg-stone/5 text-charcoal font-medium rounded-button transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      </div>

      <button
        type="button"
        onClick={onBackToExperiments}
        className="mt-4 text-sm text-stone hover:text-charcoal underline underline-offset-2"
      >
        Back to Experiments
      </button>
    </div>
  )
}
