import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

type AnswerState = {
  level: string | null
  focusArea: string | null
  defaultMode: string | null
}

const questions = [
  {
    id: 'level' as const,
    title: "What's your current microbiology level?",
    options: ['Beginner', 'Intermediate', 'Advanced'],
    layout: 'list' as const,
  },
  {
    id: 'focusArea' as const,
    title: 'What do you want to get better at first?',
    options: ['Staining', 'Aseptic Technique', 'Interpretation', 'Biochemical Testing'],
    layout: 'grid' as const,
  },
  {
    id: 'defaultMode' as const,
    title: 'How do you want to learn?',
    options: ['Guide me through it', 'Let me try on my own'],
    values: ['Learn Mode', 'Test Mode'],
    layout: 'list' as const,
  },
]

export function OnboardingFlow() {
  const navigate = useNavigate()
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AnswerState>({
    level: null,
    focusArea: null,
    defaultMode: null,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && profile) {
      const hasOnboarding = !!(
        profile.microbiology_level &&
        profile.focus_area &&
        profile.default_mode
      )
      if (hasOnboarding) {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [authLoading, profile, navigate])

  function handleSelect(value: string) {
    const question = questions[step]
    const key = question.id
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function handleNext() {
    const question = questions[step]
    const key = question.id
    const value = answers[key]

    if (!value) return

    if (step < questions.length - 1) {
      setStep((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  async function handleComplete() {
    if (!user) return

    setIsSaving(true)
    setSaveError(null)

    const mappedMode =
      answers.defaultMode === 'Guide me through it'
        ? 'Learn Mode'
        : answers.defaultMode === 'Let me try on my own'
        ? 'Test Mode'
        : null

    const { error } = await supabase
      .from('profiles')
      .update({
        microbiology_level: answers.level,
        focus_area: answers.focusArea,
        default_mode: mappedMode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    setIsSaving(false)

    if (error) {
      setSaveError(error.message)
      return
    }

    await refreshProfile()
    navigate('/dashboard', { replace: true })
  }

  function handleSkip() {
    navigate('/dashboard', { replace: true })
  }

  function getCurrentAnswer(): string | null {
    return answers[questions[step].id]
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentQuestion = questions[step]
  const currentAnswer = getCurrentAnswer()

  return (
    <div className="min-h-screen w-full bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#FDFBF7] rounded-card shadow-sm border border-stone/10 p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-charcoal mb-2">
            {currentQuestion.title}
          </h2>
        </div>

        <div
          className={`grid gap-4 mb-8 ${
            currentQuestion.layout === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1'
          }`}
        >
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer === option
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full py-4 px-5 rounded-button border-2 text-center font-medium transition-all ${
                  isSelected
                    ? 'border-coral bg-coral-50 text-coral'
                    : 'border-stone/15 bg-white text-charcoal hover:border-coral/40 hover:bg-coral-50/30'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {saveError && (
          <div className="mb-6 rounded-button bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-stone/10">
          <span className="text-sm text-stone font-medium">
            {step + 1} of {questions.length}
          </span>
          <button
            onClick={handleNext}
            disabled={!currentAnswer || isSaving}
            className="bg-coral hover:bg-coral/90 disabled:bg-coral/60 text-white font-medium px-10 py-2.5 rounded-button transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Saving
              </>
            ) : (
              'Next'
            )}
          </button>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-stone hover:text-coral transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
