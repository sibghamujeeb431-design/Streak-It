import type { TestTubeId, ReactionResult } from '../../data/biochemicalTesting'
import { ORGANISM_OPTIONS, MISCONCEPTION_OPTIONS, TEST_MEANINGS, TEST_TUBE_INFO } from '../../data/biochemicalTesting'

interface BiochemicalTestingInterpretQuizProps {
  organismAnswer: string | null
  misconceptionAnswer: string | null
  observedReactions: ReactionResult[]
  onAnswer: (field: 'organism' | 'misconception', value: string) => void
  onSubmit: () => void
}

export function BiochemicalTestingInterpretQuiz({
  organismAnswer,
  misconceptionAnswer,
  observedReactions,
  onAnswer,
  onSubmit,
}: BiochemicalTestingInterpretQuizProps) {
  return (
    <div className="space-y-6">
      {/* Reference chart */}
      <div className="bg-white rounded-card border border-stone/10 p-4">
        <h4 className="text-sm font-semibold text-charcoal mb-3">Biochemical Test Reference</h4>
        <div className="space-y-2">
          {Object.entries(TEST_TUBE_INFO).map(([tubeId, info]) => {
            const meanings = TEST_MEANINGS[tubeId as TestTubeId]
            return (
              <div key={tubeId} className="flex justify-between text-xs">
                <span className="font-medium text-charcoal">{info.name} ({info.reagent})</span>
                <span className="text-stone">
                  Positive: {meanings.positive} | Negative: {meanings.negative}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Observed results summary */}
      <div className="bg-white rounded-card border border-stone/10 p-4">
        <h4 className="text-sm font-semibold text-charcoal mb-3">Your Observed Results</h4>
        <div className="space-y-2">
          {observedReactions.map((reaction) => {
            const info = TEST_TUBE_INFO[reaction.tubeId]
            const meanings = TEST_MEANINGS[reaction.tubeId]
            return (
              <div key={reaction.tubeId} className="flex justify-between text-xs">
                <span className="font-medium text-charcoal">{info.name}</span>
                <span className={
                  reaction.result === 'positive' ? 'text-coral font-medium' :
                  reaction.result === 'negative' ? 'text-teal font-medium' :
                  'text-stone'
                }>
                  {reaction.result === 'positive' ? meanings.positive :
                   reaction.result === 'negative' ? meanings.negative :
                   'Ambiguous'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Organism identification question */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-charcoal">
          Based on this profile, which identification is most consistent?
        </label>
        <div className="space-y-2">
          {ORGANISM_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                organismAnswer === option.value
                  ? 'border-coral bg-coral/10'
                  : 'border-stone/20 hover:border-stone/40'
              }`}
            >
              <input
                type="radio"
                name="organism"
                value={option.value}
                checked={organismAnswer === option.value}
                onChange={(e) => onAnswer('organism', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-charcoal">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Misconception question */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-charcoal">
          Can you identify a species from just ONE positive test result alone?
        </label>
        <div className="space-y-2">
          {MISCONCEPTION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                misconceptionAnswer === option.value
                  ? 'border-coral bg-coral/10'
                  : 'border-stone/20 hover:border-stone/40'
              }`}
            >
              <input
                type="radio"
                name="misconception"
                value={option.value}
                checked={misconceptionAnswer === option.value}
                onChange={(e) => onAnswer('misconception', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-charcoal">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!organismAnswer || !misconceptionAnswer}
        className="w-full bg-coral hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-button transition-colors"
      >
        Submit Interpretation
      </button>
    </div>
  )
}
