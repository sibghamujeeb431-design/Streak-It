import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from './DashboardLayout'
import { MessageSquare, Lock, LogOut, Send, Microscope } from 'lucide-react'

interface LabShellProps {
  title: string
  steps: string[]
}

export function LabShell({ title, steps }: LabShellProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'learn' | 'test'>('learn')
  const [activeStep] = useState(0)
  const stepName = steps[activeStep]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-charcoal">{title}</h1>

          <div className="flex items-center gap-4">
            {/* Learn / Test toggle */}
            <div className="inline-flex bg-[#FDFBF7] rounded-button border border-stone/15 p-1">
              <button
                type="button"
                onClick={() => setMode('learn')}
                className={`px-5 py-2 text-sm font-medium rounded-button transition-colors ${
                  mode === 'learn'
                    ? 'bg-coral text-white'
                    : 'text-stone hover:text-charcoal'
                }`}
              >
                Learn
              </button>
              <button
                type="button"
                onClick={() => setMode('test')}
                className={`px-5 py-2 text-sm font-medium rounded-button transition-colors ${
                  mode === 'test'
                    ? 'bg-coral text-white'
                    : 'text-stone hover:text-charcoal'
                }`}
              >
                Test
              </button>
            </div>

            {/* Exit Lab */}
            <button
              type="button"
              onClick={() => navigate('/experiments')}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-charcoal bg-[#FDFBF7] border border-stone/15 rounded-button hover:bg-stone/5 transition-colors"
            >
              Exit Lab
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            {steps.map((step, index) => {
              const isActive = index === activeStep
              const isCompleted = index < activeStep
              const isLast = index === steps.length - 1

              return (
                <div key={step} className="flex-1 flex items-start">
                  <div className="flex flex-col items-center w-full">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                        isActive
                          ? 'bg-coral border-coral text-white'
                          : isCompleted
                            ? 'bg-coral/10 border-coral text-coral'
                            : 'bg-white border-stone/20 text-stone'
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-coral' : 'text-stone'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="flex-1 h-0.5 mt-5 mx-2 bg-stone/15" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main workspace + right panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workspace */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#FDFBF7] rounded-card border border-stone/10 min-h-[520px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-stone/10 flex items-center justify-center mb-6">
                <Microscope size={40} className="text-stone/50" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                Lab workspace
              </h3>
              <p className="text-stone max-w-sm">
                Interactive simulation for {title} is coming soon. For now, use
                the guided panel on the right to follow the protocol.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#FDFBF7] rounded-card border border-stone/10 px-5 py-4">
              <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">
                  Ready when you are.
                </p>
                <p className="text-sm text-stone">
                  Start with {stepName} to begin the experiment.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* Current Objective */}
            <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6">
              <p className="text-sm font-medium text-charcoal mb-1">
                Current Objective
              </p>
              <p className="text-sm font-semibold text-coral mb-4">
                Step {activeStep + 1} of {steps.length}
              </p>

              <h3 className="text-lg font-semibold text-charcoal mb-2">
                {stepName} your {getStepObject(title)}
              </h3>
              <p className="text-sm text-stone mb-6">
                Follow the protocol for this step. The AI mentor can guide you
                through the details in Learn mode.
              </p>

              <div className="flex items-center justify-center mb-6">
                <div className="w-28 h-28 rounded-full border-4 border-coral/20 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-charcoal">02:00</span>
                  <span className="text-xs text-stone">remaining</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-button transition-colors"
              >
                {getActionLabel(stepName)}
              </button>
            </div>

            {/* AI guidance panel */}
            {mode === 'learn' ? (
              <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} className="text-teal" />
                  <h4 className="text-sm font-semibold text-charcoal">
                    AI Lab Mentor
                  </h4>
                </div>

                <div className="bg-teal/5 rounded-card p-4 mb-4">
                  <p className="text-sm text-charcoal">
                    Welcome to {title}. I'm here to help — ask me anything about
                    the protocol, reagents, or what to do next.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-2.5 text-sm rounded-button border border-stone/20 bg-white text-charcoal placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
                  />
                  <button
                    type="button"
                    className="p-2.5 bg-teal hover:bg-teal/90 text-white rounded-button transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#FDFBF7] rounded-card border border-stone/10 p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stone/10 flex items-center justify-center">
                  <Lock size={22} className="text-stone" />
                </div>
                <p className="text-sm text-stone">
                  AI guidance is disabled in Test Mode
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function getStepObject(title: string): string {
  if (title.toLowerCase().includes('serial')) return 'dilution series'
  if (title.toLowerCase().includes('biochemical')) return 'test tubes'
  if (title.toLowerCase().includes('streak')) return 'materials'
  if (title.toLowerCase().includes('susceptibility')) return 'culture and plate'
  return 'slide'
}

function getActionLabel(stepName: string): string {
  const labelMap: Record<string, string> = {
    Prepare: 'Select Material',
    Stain: 'Apply Stain',
    Decolorize: 'Add Decolorizer',
    Counterstain: 'Add Counterstain',
    Observe: 'Switch to Microscope',
    Interpret: 'Record Result',
    Streak: 'Streak Plate',
    Incubate: 'Start Incubation',
    Inoculate: 'Inoculate Plate',
    'Place Discs': 'Place Discs',
    Dilute: 'Perform Dilution',
    'Pour Plate': 'Pour Plate',
    'Observe Reactions': 'Read Reactions',
  }
  return labelMap[stepName] ?? 'Continue'
}
