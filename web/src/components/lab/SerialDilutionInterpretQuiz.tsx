import type { QuizOption } from '../../data/labCommon'
import {
  COUNTABILITY_OPTIONS,
  MISCONCEPTION_OPTIONS,
} from '../../data/serialDilution'

interface SerialDilutionInterpretQuizProps {
  countabilityAnswer: string | null
  cfuEstimateAnswer: string | null
  misconceptionAnswer: string | null
  plateResult: { countable: boolean; colonyCount: number | null; visualState: string } | null
  selectedDilutionTube: string | null
  cfuOptions: QuizOption[]
  onAnswer: (field: 'countability' | 'cfuEstimate' | 'misconception', value: string) => void
  onSubmit: () => void
}

export function SerialDilutionInterpretQuiz({
  countabilityAnswer,
  cfuEstimateAnswer,
  misconceptionAnswer,
  plateResult,
  selectedDilutionTube,
  cfuOptions,
  onAnswer,
  onSubmit,
}: SerialDilutionInterpretQuizProps) {
  const canSubmit = countabilityAnswer !== null && 
    (plateResult?.countable ? cfuEstimateAnswer !== null : true) && 
    misconceptionAnswer !== null

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">
          Is this plate countable?
        </h3>
        <div className="space-y-3">
          {COUNTABILITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onAnswer('countability', option.value)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                countabilityAnswer === option.value
                  ? 'border-teal bg-teal/10'
                  : 'border-stone/20 hover:border-stone/40'
              }`}
            >
              <p className="text-sm font-medium text-charcoal">{option.label}</p>
            </button>
          ))}
        </div>
      </div>

      {plateResult?.countable && plateResult.colonyCount !== null && (
        <div>
          <h3 className="text-lg font-semibold text-charcoal mb-2">
            Estimate the original CFU/mL
          </h3>
          <p className="text-sm text-stone mb-4">
            Colony count observed: {plateResult.colonyCount} colonies
            <br />
            Selected dilution: {selectedDilutionTube}
          </p>
          <div className="space-y-3">
            {cfuOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer('cfuEstimate', option.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  cfuEstimateAnswer === option.value
                    ? 'border-teal bg-teal/10'
                    : 'border-stone/20 hover:border-stone/40'
                }`}
              >
                <p className="text-sm font-medium text-charcoal">{option.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">
          Does one colony always represent exactly one original cell?
        </h3>
        <div className="space-y-3">
          {MISCONCEPTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onAnswer('misconception', option.value)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                misconceptionAnswer === option.value
                  ? 'border-teal bg-teal/10'
                  : 'border-stone/20 hover:border-stone/40'
              }`}
            >
              <p className="text-sm font-medium text-charcoal">{option.label}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full px-6 py-3 bg-teal hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-button transition-colors"
      >
        Submit Interpretation
      </button>
    </div>
  )
}
