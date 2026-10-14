import { useEffect, useState, useMemo } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { useAuth } from '../context/useAuth'
import { fetchAttempts } from '../lib/experimentAttempts'
import { calculateStreak, getStreakRemark } from '../lib/streak'

export function DashboardPage() {
  const { profile, user } = useAuth()
  const [attempts, setAttempts] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    fetchAttempts(user.id)
      .then(({ data }) => {
        setAttempts(data ?? [])
      })
      .catch((err) => {
        console.error('Failed to fetch attempts:', err)
      })
  }, [user])

  const streak = useMemo(() => calculateStreak(attempts), [attempts])
  const streakRemark = useMemo(() => getStreakRemark(streak), [streak])

  const personalizedNote = useMemo(() => {
    if (!profile) return null
    const level = profile.microbiology_level
    const focus = profile.focus_area
    const mode = profile.default_mode

    // Fallback for missing profile data
    if (!level || !focus || !mode) {
      return 'Complete your onboarding to receive personalized learning guidance.'
    }

    // Beginner guidance preference
    if (level === 'Beginner' && mode === 'Learn Mode') {
      if (focus === 'Staining') return 'Start with Gram Staining to master the basics. Focus on timing and technique for accurate results.'
      if (focus === 'Aseptic Technique') return 'Practice maintaining sterile conditions. Good technique prevents contamination in all your work.'
      if (focus === 'Interpretation') return 'Begin by learning to identify common cell shapes and staining patterns. Observation is key.'
      if (focus === 'Biochemical Testing') return 'Start with simple metabolic tests once you are comfortable with basic techniques.'
    }

    // Beginner independent preference
    if (level === 'Beginner' && mode === 'Test Mode') {
      if (focus === 'Staining') return 'Try completing a Gram Staining experiment independently. Review your results to improve.'
      if (focus === 'Aseptic Technique') return 'Challenge yourself to work without guidance. Check your sterility at each step.'
      if (focus === 'Interpretation') return 'Practice interpreting slides on your own. Compare your conclusions with references.'
      if (focus === 'Biochemical Testing') return 'Attempt basic tests independently when you are ready. Learn from each result.'
    }

    // Intermediate guidance preference
    if (level === 'Intermediate' && mode === 'Learn Mode') {
      if (focus === 'Staining') return 'Refine your technique by paying attention to decolorization timing. Small adjustments improve accuracy.'
      if (focus === 'Aseptic Technique') return 'Focus on consistency in your workflow. Smooth, confident movements prevent errors.'
      if (focus === 'Interpretation') return 'Work with unknown samples to build confidence. Use systematic approaches to identify patterns.'
      if (focus === 'Biochemical Testing') return 'Explore biochemical identification methods. Understand how different tests complement each other.'
    }

    // Intermediate independent preference
    if (level === 'Intermediate' && mode === 'Test Mode') {
      if (focus === 'Staining') return 'Challenge yourself with more complex samples. Aim for higher accuracy in your interpretations.'
      if (focus === 'Aseptic Technique') return 'Work under time pressure to build efficiency. Maintain sterility even when moving quickly.'
      if (focus === 'Interpretation') return 'Tackle difficult samples independently. Document your reasoning for each conclusion.'
      if (focus === 'Biochemical Testing') return 'Design your own testing approach. Use your knowledge to select appropriate tests.'
    }

    // Advanced guidance preference
    if (level === 'Advanced' && mode === 'Learn Mode') {
      if (focus === 'Staining') return 'Perfect your technique for atypical samples. Share your knowledge with others to reinforce learning.'
      if (focus === 'Aseptic Technique') return 'Master advanced sterile techniques for complex procedures. Precision becomes critical.'
      if (focus === 'Interpretation') return 'Develop expertise in interpreting difficult or mixed samples. Your experience is valuable.'
      if (focus === 'Biochemical Testing') return 'Master comprehensive biochemical identification. Integrate multiple test results for accurate IDs.'
    }

    // Advanced independent preference
    if (level === 'Advanced' && mode === 'Test Mode') {
      if (focus === 'Staining') return 'Push your skills with challenging specimens. Teach others to deepen your own understanding.'
      if (focus === 'Aseptic Technique') return 'Work on complex procedures with full independence. Your technique should be second nature.'
      if (focus === 'Interpretation') return 'Take on the most difficult cases. Your systematic approach should handle any sample.'
      if (focus === 'Biochemical Testing') return 'Apply comprehensive testing to unknowns. Trust your judgment and verify with references.'
    }

    return 'Continue building your skills with regular practice.'
  }, [profile])

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Your Lab, Your Space</h1>
          <p className="text-xl text-stone mb-4">Hey, Scientist!</p>
          <p className="text-lg text-coral font-medium">Ready to learn something new today?</p>
        </div>

        {/* Streak Card */}
        <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone mb-1">Learning Streak</p>
              <p className="text-3xl font-bold text-charcoal">
                {streak} <span className="text-lg text-stone"> DAYS</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-stone italic">{streakRemark}</p>
            </div>
          </div>
        </div>

        {/* Profile Cards */}
        {profile && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-5">
              <p className="text-xs text-stone uppercase tracking-wide mb-1">Level</p>
              <p className="text-lg font-semibold text-charcoal">
                {profile.microbiology_level || 'Not set'}
              </p>
            </div>
            <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-5">
              <p className="text-xs text-stone uppercase tracking-wide mb-1">Focus</p>
              <p className="text-lg font-semibold text-charcoal">
                {profile.focus_area || 'Not set'}
              </p>
            </div>
            <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-5">
              <p className="text-xs text-stone uppercase tracking-wide mb-1">Default Mode</p>
              <p className="text-lg font-semibold text-charcoal">
                {profile.default_mode || 'Not set'}
              </p>
            </div>
          </div>
        )}

        {/* Note Component */}
        <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6 mb-6">
          <h2 className="text-lg font-semibold text-charcoal mb-2">A little note for you</h2>
          <div className="text-stone text-sm min-h-[60px]">
            {personalizedNote || 'Complete your onboarding to receive personalized learning guidance.'}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}