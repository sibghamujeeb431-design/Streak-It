import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { StreakLine } from '../components/StreakLine'

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
            Log in
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
            </div>
          </div>

          {/* Right column - lab scene image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-[#E8E2D8] rounded-card overflow-hidden">
              <img
                src="/microbiology-hero.png"
                alt="Microbiology lab scene"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
