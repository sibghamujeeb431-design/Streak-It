export type LabMode = 'learn' | 'test'

export type StepInfo = {
  objective: string
  instruction: string
  actionLabel: string
  helperText: string
}

export type QuizOption = {
  value: string
  label: string
}

export type BenchItem = {
  id: string
  name: string
  kind: string
  correct: boolean
  sterile: boolean
  image: string
  subtitle?: string
}
