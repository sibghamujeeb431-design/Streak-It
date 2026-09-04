import { MISCONCEPTION_OPTIONS, CLASSIFICATION_OPTIONS } from '../../data/ast'

interface AstInterpretQuizProps {
  classificationAnswer: string | null
  misconceptionAnswer: string | null
  onAnswer: (field: 'classification' | 'misconception', value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function AstInterpretQuiz({
  classificationAnswer,
  misconceptionAnswer,
  onAnswer,
  onSubmit,
  disabled = false,
}: AstInterpretQuizProps) {
  const canSubmit = classificationAnswer && misconceptionAnswer

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-charcoal mb-3">
          1. Based on the zone sizes, classify this organism&rsquo;s response to
          Gentamicin.
        </p>
        <div className="space-y-2">
          {CLASSIFICATION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-button border cursor-pointer transition-colors ${
                classificationAnswer === option.value
                  ? 'border-coral bg-coral-50'
                  : 'border-stone/15 bg-white hover:border-coral/30'
              }`}
            >
              <input
                type="radio"
                name="classification"
                value={option.value}
                checked={classificationAnswer === option.value}
                onChange={() => onAnswer('classification', option.value)}
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
          2. Does a larger inhibition zone always mean a stronger antibiotic?
        </p>
        <div className="space-y-2">
          {MISCONCEPTION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-button border cursor-pointer transition-colors ${
                misconceptionAnswer === option.value
                  ? 'border-coral bg-coral-50'
                  : 'border-stone/15 bg-white hover:border-coral/30'
              }`}
            >
              <input
                type="radio"
                name="misconception"
                value={option.value}
                checked={misconceptionAnswer === option.value}
                onChange={() => onAnswer('misconception', option.value)}
                disabled={disabled}
                className="accent-coral"
              />
              <span className="text-sm text-charcoal">{option.label}</span>
            </label>
          ))}
        </div>
        {misconceptionAnswer === 'yes-bigger-stronger' && (
          <div className="mt-3 rounded-button border border-coral/30 bg-coral-50 p-3">
            <p className="text-sm font-medium text-coral mb-1">
              Careful — this is a common misconception.
            </p>
            <p className="text-xs text-charcoal">
              A larger inhibition zone does not automatically mean a stronger
              antimicrobial. Zone size reflects how far the drug diffuses under
              the test conditions; interpretation is only valid against the
              standardized breakpoints for that specific drug and organism.
            </p>
          </div>
        )}
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
