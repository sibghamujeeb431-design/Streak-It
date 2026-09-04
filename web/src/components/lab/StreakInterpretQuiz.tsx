import { RESULT_OPTIONS, REASONING_OPTIONS } from '../../data/streakPlate'

interface StreakInterpretQuizProps {
  resultAnswer: string | null
  reasoningAnswer: string | null
  onAnswer: (field: 'result' | 'reasoning', value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function StreakInterpretQuiz({
  resultAnswer,
  reasoningAnswer,
  onAnswer,
  onSubmit,
  disabled = false,
}: StreakInterpretQuizProps) {
  const canSubmit = resultAnswer && reasoningAnswer

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-charcoal mb-3">
          1. What pattern do you observe on the plate?
        </p>
        <div className="space-y-2">
          {RESULT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-button border cursor-pointer transition-colors ${
                resultAnswer === option.value
                  ? 'border-coral bg-coral-50'
                  : 'border-stone/15 bg-white hover:border-coral/30'
              }`}
            >
              <input
                type="radio"
                name="result"
                value={option.value}
                checked={resultAnswer === option.value}
                onChange={() => onAnswer('result', option.value)}
                disabled={disabled}
                className="accent-coral"
              />
              <span className="text-sm text-charcoal">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-charcoal mb-3">
          2. What explains this result?
        </p>
        <div className="space-y-2">
          {REASONING_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-button border cursor-pointer transition-colors ${
                reasoningAnswer === option.value
                  ? 'border-coral bg-coral-50'
                  : 'border-stone/15 bg-white hover:border-coral/30'
              }`}
            >
              <input
                type="radio"
                name="reasoning"
                value={option.value}
                checked={reasoningAnswer === option.value}
                onChange={() => onAnswer('reasoning', option.value)}
                disabled={disabled}
                className="accent-coral"
              />
              <span className="text-sm text-charcoal">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || disabled}
        className="w-full bg-coral hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-button transition-colors"
      >
        Submit Interpretation
      </button>
    </div>
  )
}
