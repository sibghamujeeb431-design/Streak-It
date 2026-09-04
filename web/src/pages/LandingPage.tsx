import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { StreakLine } from '../components/StreakLine'
import { ArrowRight } from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-ivory relative overflow-hidden">
      <StreakLine />

      {/* Navigation */}
      <header className="relative z-10 flex items-center justify-between px-8 lg:px-16 py-6">
        <Logo height={40} />
        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate('/onboarding')}
            className="text-sm font-medium text-charcoal hover:text-coral transition-colors"
          >
            Experiments
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="text-sm font-medium text-charcoal hover:text-coral transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-coral hover:bg-coral/90 text-white text-sm font-medium px-5 py-2.5 rounded-button transition-colors"
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center px-8 lg:px-16 py-12 min-h-[calc(100vh-96px)]">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-charcoal leading-[1.1] tracking-tight">
              Microbiology,
              <br />
              Reimagined
            </h1>
            <p className="text-lg text-stone max-w-md">
              A new way to learn microbiology through real experiments.
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/onboarding')}
                className="bg-coral hover:bg-coral/90 text-white text-base font-medium px-8 py-3.5 rounded-button transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/onboarding')}
                className="group flex items-center gap-2 text-charcoal font-medium hover:text-coral transition-colors"
              >
                See how it works
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/* Right column - lab scene placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] bg-[#E8E2D8] rounded-card overflow-hidden flex items-center justify-center">
              <div className="text-center text-stone">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-stone/10 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-stone/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Lab scene coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
