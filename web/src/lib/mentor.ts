export type MentorMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type MentorPrompt = {
  referenceText: string
  contextString: string
}

export type MentorReply = {
  reply: string
  error?: string
}

export function buildSystemPrompt({ referenceText, contextString }: MentorPrompt): string {
  return `${referenceText}\n\n## Current Student Context\n\n${contextString}\n\nRespond in 1–3 sentences. Be helpful, accurate, and encouraging.`
}

export async function sendMentorMessage(
  userMessage: string,
  history: MentorMessage[],
  prompt: MentorPrompt,
  fallbackHint?: string,
): Promise<MentorReply> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const apiUrl =
    import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions'
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

  const hint =
    fallbackHint ||
    'Check the Current Objective panel and remember: sequence matters, and decolorization is the critical step.'

  if (!apiKey || apiKey === 'your_openai_api_key') {
    return {
      reply: `The AI mentor is not configured. Add VITE_OPENAI_API_KEY to your .env file to enable live hints. For now, ${hint}`,
      error: 'Missing API key',
    }
  }

  const messages = [
    { role: 'system', content: buildSystemPrompt(prompt) },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.5,
        max_tokens: 200,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`API error ${response.status}: ${errorBody}`)
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      throw new Error('Empty response from mentor API')
    }

    return { reply }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      reply: `The AI mentor is having trouble connecting. You can keep going — ${hint}`,
      error: message,
    }
  }
}
