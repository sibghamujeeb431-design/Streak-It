import { useState, useRef, useEffect } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { useAuth } from '../context/useAuth'
import { getExperimentAttempts } from '../lib/experimentAttempts'
import { sendMentorMessage, type MentorMessage } from '../lib/mentor'
import { VisualReferencePanel } from '../components/ai-lab/VisualReferencePanel'
import condensedReference from '../../docs/StreakIt_AI_Lab_Condensed_Reference.md?raw'
import gramStainingFull from '../../docs/StreakIt_AI_Lab_Mentor_Reference.md?raw'
import astFull from '../../docs/StreakIt_AST_Mentor_Reference.md?raw'
import streakPlateFull from '../../docs/StreakIt_Streak_Plate_Mentor_Reference.md?raw'
import serialDilutionFull from '../../docs/StreakIt_Serial_Dilution_Mentor_Reference.md?raw'

type Topic = 'gram-staining' | 'streak-plate' | 'ast' | 'serial-dilution' | 'biochemical-testing' | null

const SUGGESTED_QUESTIONS = [
  "Why doesn't a bigger inhibition zone mean a stronger antibiotic?",
  "Does one colony always mean one cell?",
  "Is Gram-positive better than Gram-negative?",
  "Can I identify a species from just one biochemical test?",
]

// Keywords to detect which experiment the conversation is about
const EXPERIMENT_KEYWORDS: Record<string, string[]> = {
  'gram-staining': ['gram', 'crystal violet', 'iodine', 'decoloriz', 'safranin', 'peptidoglycan', 'cell wall'],
  'streak-plate': ['streak', 'colony', 'quadrant', 'flame', 'loop', 'aseptic', 'isolate'],
  'ast': ['zone', 'antibiotic', 'susceptible', 'resistant', 'breakpoint', 'disc', 'inhibition'],
  'serial-dilution': ['dilution', 'cfu', 'concentration', '10^-', 'tube', 'plate', 'count'],
  'biochemical-testing': ['biochemical', 'enzyme', 'catalase', 'oxidase', 'indole', 'citrate', 'urease', 'profile'],
}

function detectExperiment(conversation: MentorMessage[]): string | null {
  const fullText = conversation.map(m => m.content.toLowerCase()).join(' ')
  
  for (const [experiment, keywords] of Object.entries(EXPERIMENT_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => fullText.includes(keyword)).length
    if (matchCount >= 2) {
      return experiment
    }
  }
  return null
}

function getReferenceText(conversation: MentorMessage[]): string {
  const detectedExperiment = detectExperiment(conversation)
  
  const fullReferences: Record<string, string> = {
    'gram-staining': gramStainingFull,
    'streak-plate': streakPlateFull,
    'ast': astFull,
    'serial-dilution': serialDilutionFull,
    'biochemical-testing': '', // Biochemical testing is already in the condensed ref
  }
  
  if (detectedExperiment && fullReferences[detectedExperiment]) {
    // Use full reference for the detected experiment
    return `${fullReferences[detectedExperiment]}\n\n## Personality and Tone\n\nYou are a warm, conversational, encouraging microbiology tutor. Speak naturally and use phrases like "Nice catch," "That's exactly the kind of mistake that trips people up," or "You already nailed this concept" when relevant. Be friendly and approachable, like a sharp tutor who cares about student learning — not a robot reciting facts, and not forced slang. Keep responses to 2–4 sentences unless more detail is genuinely needed.`
  }
  
  // Use condensed reference by default
  return condensedReference
}

export function AiLabPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<MentorMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentTopic, setCurrentTopic] = useState<Topic>(null)
  const [userPerformance, setUserPerformance] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch user's experiment attempts for personalization
  useEffect(() => {
    async function fetchPerformance() {
      if (!user) return
      try {
        const attempts = await getExperimentAttempts(user.id)
        if (attempts.length === 0) {
          setUserPerformance('No completed experiments yet.')
          return
        }
        const summary = attempts
          .map((a) => `${a.experiment_name}: ${Math.round(a.score)}%`)
          .join(', ')
        setUserPerformance(summary)
      } catch (error) {
        console.error('Failed to fetch performance:', error)
        setUserPerformance('Performance data unavailable.')
      }
    }
    fetchPerformance()
  }, [user])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Detect topic from AI response
  useEffect(() => {
    if (messages.length === 0) return
    const lastAiMessage = messages[messages.length - 1]
    if (lastAiMessage.role === 'assistant') {
      const text = lastAiMessage.content.toLowerCase()
      if (text.includes('gram') && text.includes('stain')) {
        setCurrentTopic('gram-staining')
      } else if (text.includes('streak') || text.includes('colony')) {
        setCurrentTopic('streak-plate')
      } else if (text.includes('zone') || text.includes('antibiotic') || text.includes('susceptible')) {
        setCurrentTopic('ast')
      } else if (text.includes('dilution') || text.includes('concentration') || text.includes('cfu')) {
        setCurrentTopic('serial-dilution')
      } else if (text.includes('biochemical') || text.includes('test') || text.includes('enzyme')) {
        setCurrentTopic('biochemical-testing')
      }
    }
  }, [messages])

  async function handleSend(question: string) {
    if (!question.trim() || isLoading) return

    const userMessage: MentorMessage = { role: 'user', content: question }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    // Dynamically build reference based on conversation
    const referenceText = getReferenceText(newMessages)

    const contextString = userPerformance
      ? `This student has completed experiments with these scores: ${userPerformance}. When relevant, reference their past performance naturally — for example, if they ask about a concept they've already done well, mention that they've nailed it before.`
      : 'This student has not completed any experiments yet.'

    const prompt = {
      referenceText,
      contextString,
    }

    const { reply } = await sendMentorMessage(question, messages, prompt, 'try asking again in a moment.')

    const aiMessage: MentorMessage = { role: 'assistant', content: reply }
    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  function handleSuggestedQuestion(question: string) {
    handleSend(question)
  }

  function handleRelatedTopic(topic: string) {
    handleSend(`Tell me about ${topic}`)
  }

  const showSuggestions = messages.length === 0

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          {/* Left sidebar - handled by DashboardLayout */}
          <div className="hidden lg:block lg:col-span-2" />

          {/* Center - Chat */}
          <div className="lg:col-span-7 flex flex-col bg-surface rounded-card border border-stone/10 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone/10">
              <h1 className="text-2xl font-bold text-charcoal">AI Lab Mentor</h1>
              <p className="text-sm text-stone mt-1">Ask anything about microbiology.</p>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center">
                    <span className="text-3xl">🧪</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-charcoal">Hi there!</p>
                    <p className="text-sm text-stone mt-1">
                      I'm your AI Lab Mentor. Ask me anything about microbiology techniques,
                      common mistakes, or how to interpret your results.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-coral/10 text-charcoal'
                          : 'bg-white text-charcoal border border-stone/10'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <p className="text-xs font-semibold text-coral mb-1">AI Lab Mentor</p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className="text-xs text-stone/60 mt-2">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-coral animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-coral animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-coral animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {showSuggestions && (
              <div className="px-6 py-3 border-t border-stone/10">
                <p className="text-xs text-stone mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs px-3 py-1.5 rounded-full border border-coral/30 text-coral hover:bg-coral/10 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="px-6 py-4 border-t border-stone/10 bg-white">
              <div className="flex items-center gap-3">
                <button className="text-stone hover:text-charcoal transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="flex-1 bg-stone/5 rounded-full px-4 py-2 text-sm text-charcoal placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="text-coral hover:text-coral/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right - Visual Reference */}
          <div className="lg:col-span-3">
            <VisualReferencePanel
              topic={currentTopic}
              onRelatedTopic={handleRelatedTopic}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
