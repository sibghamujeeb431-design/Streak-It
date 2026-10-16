import type { ExperimentAttempt } from './supabase'

const pakistanDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Karachi',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function getPakistanDate(date: Date): string {
  const parts = pakistanDateFormatter.formatToParts(date)
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  )

  return `${values.year}-${values.month}-${values.day}`
}

function getPreviousDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number)

  return new Date(Date.UTC(year, month - 1, day - 1))
    .toISOString()
    .slice(0, 10)
}

export function calculateStreak(attempts: ExperimentAttempt[]): number {
  const dates = new Set(
    attempts
      .map((attempt) => new Date(attempt.completed_at))
      .filter((date) => !Number.isNaN(date.getTime()))
      .map(getPakistanDate),
  )

  let streak = 0
  let checkDate = getPakistanDate(new Date())

  // Keep yesterday's streak active if the student hasn't practised today.
  if (!dates.has(checkDate)) {
    checkDate = getPreviousDate(checkDate)
  }

  while (dates.has(checkDate)) {
    streak += 1
    checkDate = getPreviousDate(checkDate)
  }

  return streak
}

export function getStreakRemark(streak: number): string {
  if (streak === 0) return 'Start your learning journey today!'
  if (streak === 1) return 'Great start! Keep it going.'
  if (streak === 2) return "You're building momentum!"
  if (streak === 3) return 'Three days in a row - fantastic!'
  if (streak >= 4 && streak <= 6) return "You're on a roll!"
  if (streak >= 7 && streak <= 13) return 'Incredible dedication!'
  if (streak >= 14) return "You're unstoppable!"
  return 'Amazing consistency!'
}
