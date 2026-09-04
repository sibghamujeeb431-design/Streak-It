import { useCallback, useRef, useState } from 'react'
import { Lock, Send, Bot } from 'lucide-react'
import type { LabMode } from '../../data/labCommon'
import {
  sendMentorMessage,
  type MentorMessage,
  type MentorPrompt,
} from '../../lib/mentor'

interface MentorPanelProps {
  mode: LabMode
  prompt: MentorPrompt
  greeting: string
  fallbackHint?: string
}

export function MentorPanel({
  mode,
  prompt,
  greeting,
  fallbackHint,
}: MentorPanelProps) {
  const [messages, setMessages] = useState<MentorMessage[]>([
    { role: 'assistant', content: greeting },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: MentorMessage = { role: 'user', content: text }
    const history = [...messages]
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    const { reply, error: mentorError } = await sendMentorMessage(
      text,
      history,
      prompt,
      fallbackHint,
    )

    setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    if (mentorError) {
      setError(mentorError)
    }
    setLoading(false)
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [input, loading, messages, prompt, fallbackHint])

  if (mode === 'test') {
    return (
      <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stone/10 flex items-center justify-center">
          <Lock size={22} className="text-stone" />
        </div>
        <p className="text-sm text-stone">AI guidance is disabled in Test Mode</p>
      </div>
    )
  }

  return (
    <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6 flex flex-col h-[420px]">
      <div className="flex items-center gap-2 mb-4">
        <Bot size={18} className="text-teal" />
        <h4 className="text-sm font-semibold text-charcoal">AI Lab Mentor</h4>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-card text-sm ${
              msg.role === 'user'
                ? 'bg-coral-50 text-charcoal ml-8'
                : 'bg-teal/5 text-charcoal mr-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="bg-teal/5 rounded-card p-3 text-sm text-stone animate-pulse">
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="text-xs text-coral mb-2">
          Mentor connection issue: {error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-sm rounded-button border border-stone/20 bg-white text-charcoal placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-2.5 bg-teal hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-button transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
