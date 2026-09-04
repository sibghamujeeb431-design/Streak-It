import { supabase, type ExperimentAttempt } from './supabase'

export type AttemptInput = {
  experimentName: string
  score: number
  proceduralAccuracy: number
  decisionAccuracy: number
  interpretationAccuracy: number
  mode: 'learn' | 'test'
}

export async function saveAttempt(
  userId: string,
  input: AttemptInput,
): Promise<{ data: ExperimentAttempt | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('experiment_attempts')
    .insert({
      user_id: userId,
      experiment_name: input.experimentName,
      score: input.score,
      procedural_accuracy: input.proceduralAccuracy,
      decision_accuracy: input.decisionAccuracy,
      interpretation_accuracy: input.interpretationAccuracy,
      mode: input.mode,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  return { data: data as ExperimentAttempt, error: null }
}

export async function fetchAttempts(
  userId: string,
): Promise<{ data: ExperimentAttempt[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('experiment_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) {
    return { data: [], error: new Error(error.message) }
  }

  return { data: (data as ExperimentAttempt[]) ?? [], error: null }
}
