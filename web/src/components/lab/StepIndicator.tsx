import { Check } from 'lucide-react'

interface StepIndicatorProps {
  steps: string[]
  activeStep: number
}

export function StepIndicator({ steps, activeStep }: StepIndicatorProps) {
  return (
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
                  {isCompleted ? <Check size={20} strokeWidth={2.5} /> : index + 1}
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
                <div
                  className={`flex-1 h-0.5 mt-5 mx-2 ${
                    isCompleted ? 'bg-coral' : 'bg-stone/15'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
