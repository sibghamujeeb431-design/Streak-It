import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { experiments } from '../data/experiments'
import { useAuth } from '../context/useAuth'
import { fetchAttempts } from '../lib/experimentAttempts'
import type { ExperimentAttempt } from '../lib/supabase'
import {
  FlaskConical,
  Microscope,
  BrainCircuit,
  ShieldCheck,
  GitBranch,
  Pill,
  Trophy,
  Calendar,
} from 'lucide-react'
import { ALL_SKILL_LABELS, computeSkillAverages, type SkillLabel } from '../data/skills'

const SKILL_ICONS: Record<SkillLabel, React.ReactNode> = {
  'Staining Techniques': <FlaskConical size={18} className="text-coral" />,
  'Microscopy': <Microscope size={18} className="text-teal" />,
  'Aseptic Methods': <ShieldCheck size={18} className="text-charcoal" />,
  'Colony Isolation': <GitBranch size={18} className="text-teal" />,
  'Susceptibility Testing': <Pill size={18} className="text-coral" />,
  'Data Interpretation': <BrainCircuit size={18} className="text-charcoal" />,
}

export function ProgressPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [attempts, setAttempts] = useState<ExperimentAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    fetchAttempts(user.id)
      .then(({ data, error }) => {
        if (error) {
          setError(error.message)
        } else {
          setAttempts(data)
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => setLoading(false))
  }, [user])

  const bestByExperiment = useMemo(() => {
    const map = new Map<string, number>()
    for (const attempt of attempts) {
      const current = map.get(attempt.experiment_name) ?? -1
      if (attempt.score > current) {
        map.set(attempt.experiment_name, attempt.score)
      }
    }
    return map
  }, [attempts])

  const experimentsCompleted = useMemo(
    () => experiments.filter((e) => bestByExperiment.has(e.title)).length,
    [bestByExperiment],
  )

  const overallProgress = useMemo(() => {
    const scores = experiments
      .map((e) => bestByExperiment.get(e.title))
      .filter((s): s is number => typeof s === 'number')
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }, [bestByExperiment])

  const skillAverages = useMemo(() => computeSkillAverages(attempts), [attempts])

  const { streak, heatmapDates } = useMemo(() => {
    const dates = Array.from(new Set(attempts.map((a) => a.completed_at.slice(0, 10))))
    dates.sort()

    let streak = 0
    const today = new Date().toISOString().slice(0, 10)
    let checkDate = new Date()

    while (true) {
      const dateString = checkDate.toISOString().slice(0, 10)
      if (dates.includes(dateString)) {
        streak += 1
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (dateString === today && streak === 0) {
        // Allow today to be skipped once if no attempt yet today.
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return { streak, heatmapDates: new Set(dates) }
  }, [attempts])

  function getBand(score: number | undefined) {
    if (score === undefined) return { label: 'Not started', color: 'text-stone' }
    if (score >= 85) return { label: 'Mastered', color: 'text-teal' }
    if (score >= 55) return { label: 'Good', color: 'text-coral' }
    return { label: 'Practice needed', color: 'text-stone' }
  }

  function getHeatmapWeeks(): string[][] {
    const weeks: string[][] = []
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 84)

    let currentWeek: string[] = []
    const cursor = new Date(start)

    while (cursor <= end) {
      const dateString = cursor.toISOString().slice(0, 10)
      currentWeek.push(dateString)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      cursor.setDate(cursor.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks.slice(-12)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-charcoal mb-6">Progress</h1>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-charcoal mb-6">Progress</h1>
          <div className="bg-coral/5 border border-coral/10 rounded-card p-6 text-coral">
            Failed to load progress: {error}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (attempts.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal/10 flex items-center justify-center">
            <Trophy size={32} className="text-teal" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-3">No attempts yet</h1>
          <p className="text-stone mb-8">
            Complete an experiment to see your progress, skills breakdown, and daily streak.
          </p>
          <button
            type="button"
            onClick={() => navigate('/experiments')}
            className="px-6 py-3 bg-coral hover:bg-coral/90 text-white font-medium rounded-button transition-colors"
          >
            Go to Experiments
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const heatmapWeeks = getHeatmapWeeks()

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal mb-6">Progress</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6">
            <p className="text-sm text-stone mb-1">Overall Progress</p>
            <p className="text-3xl font-bold text-charcoal">{overallProgress}%</p>
            <div className="mt-3 h-2 bg-stone/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-coral rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6">
            <p className="text-sm text-stone mb-1">Experiments Completed</p>
            <p className="text-3xl font-bold text-charcoal">
              {experimentsCompleted} <span className="text-lg text-stone">/ {experiments.length}</span>
            </p>
          </div>

          <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-coral" />
              <p className="text-sm text-stone">Current Streak</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">{streak} days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Experiment Scores</h2>
            <div className="space-y-3">
              {experiments.map((experiment) => {
                const score = bestByExperiment.get(experiment.title)
                const band = getBand(score)
                return (
                  <div
                    key={experiment.id}
                    className="flex items-center justify-between p-3 rounded-button border border-stone/10 bg-white"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal">{experiment.title}</p>
                      <p className="text-xs text-stone">{experiment.difficulty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-charcoal">
                        {score !== undefined ? `${score}%` : '—'}
                      </p>
                      <p className={`text-xs font-medium ${band.color}`}>{band.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Skills Breakdown</h2>
            <div className="space-y-4">
              {ALL_SKILL_LABELS.map((label) => {
                const value = skillAverages[label] ?? 0
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {SKILL_ICONS[label]}
                        <span className="text-sm font-medium text-charcoal">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-charcoal">{value}%</span>
                    </div>
                    <div className="h-2 bg-stone/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal rounded-full transition-all"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Activity Heatmap</h2>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {heatmapWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date) => {
                  const hasActivity = heatmapDates.has(date)
                  return (
                    <div
                      key={date}
                      title={date}
                      className={`w-3 h-3 rounded-sm ${
                        hasActivity ? 'bg-coral' : 'bg-stone/15'
                      }`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <p className="text-xs text-stone mt-2">Each square represents one day. Coral = experiment completed.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
