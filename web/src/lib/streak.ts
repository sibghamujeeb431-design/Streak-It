import type { ExperimentAttempt } from './supabase'

export function calculateStreak(attempts: ExperimentAttempt[]): number {
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

  return streak
}

export function getStreakRemark(streak: number): string {
  if (streak === 0) return "Start your learning journey today!"
  if (streak === 1) return "Great start! Keep it going."
  if (streak === 2) return "You're building momentum!"
  if (streak === 3) return "Three days in a row—fantastic!"
  if (streak >= 4 && streak <= 6) return "You're on a roll!"
  if (streak >= 7 && streak <= 13) return "Incredible dedication!"
  if (streak >= 14) return "You're unstoppable!"
  return "Amazing consistency!"
}
