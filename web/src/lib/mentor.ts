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
  return `${referenceText}\n\n## Current Student Context\n\n${contextString}\n\n## Personality and Tone\n\nYou are a warm, conversational, encouraging microbiology tutor. Speak naturally and use phrases like "Nice catch," "That's exactly the kind of mistake that trips people up," or "You already nailed this concept" when relevant. Be friendly and approachable, like a sharp tutor who cares about student learning — not a robot reciting facts, and not forced slang. Keep responses to 2–4 sentences unless more detail is genuinely needed.`
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

  console.log('Mentor API request:', { model, apiUrl, messageLength: userMessage.length })

  const hint =
    fallbackHint || 'try asking again in a moment.'

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
    const timeoutId = setTimeout(() => controller.abort(), 30000) // Increased to 30s for larger prompts

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Mentor API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        url: apiUrl,
        model,
      })
      throw new Error(`API error ${response.status}: ${errorBody}`)
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      console.error('Empty response from mentor API:', data)
      throw new Error('Empty response from mentor API')
    }

    return { reply }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Mentor API connection error:', {
      error,
      message,
      url: apiUrl,
      model,
    })
    return {
      reply: `The AI mentor is having trouble connecting. You can keep going — ${hint}`,
      error: message,
    }
  }
}
