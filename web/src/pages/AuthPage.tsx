import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Logo } from '../components/Logo'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export function AuthPage() {
  const navigate = useNavigate()
  const { user, profile, loading: authLoading, signUp, signIn } = useAuth()

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<ReactNode | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [justSignedIn, setJustSignedIn] = useState(false)

  useEffect(() => {
    if (justSignedIn && user && profile && !authLoading) {
      const hasOnboarding = !!(
        profile.microbiology_level &&
        profile.focus_area &&
        profile.default_mode
      )
      if (hasOnboarding) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/onboarding/questions', { replace: true })
      }
    }
  }, [justSignedIn, user, profile, authLoading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (isSignUp) {
      const { error } = await signUp(email, password)
      setIsSubmitting(false)
      if (error) {
        setError(getFriendlyError(error))
      } else {
        navigate('/onboarding/questions', { replace: true })
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setIsSubmitting(false)
        setError(getFriendlyError(error))
      } else {
        setJustSignedIn(true)
      }
    }
  }

  function switchToSignUp() {
    setIsSignUp(true)
    setError(null)
  }

  function getFriendlyError(error: { message: string }): ReactNode {
    const msg = error.message.toLowerCase()
    if (msg.includes('invalid login credentials')) {
      return (
        <span>
          No account found or password is incorrect.{" "}
          <button
            type="button"
            onClick={switchToSignUp}
            className="font-semibold underline hover:text-coral"
          >
            Sign up instead
          </button>
        </span>
      )
    }
    if (msg.includes('email already registered') || msg.includes('user already registered')) {
      return 'This email is already registered. Try logging in instead.'
    }
    if (msg.includes('password')) {
      return 'Password should be at least 6 characters.'
    }
    if (msg.includes('email')) {
      return 'Please enter a valid email address.'
    }
    return error.message
  }

  return (
    <div className="min-h-screen w-full bg-ivory flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle streak decoration */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="authStreak" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C96A45" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2E7D6E" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M-80 800 C 200 720, 520 600, 800 480 S 1200 320, 1520 120"
          stroke="url(#authStreak)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 w-full max-w-md bg-[#FDFBF7] rounded-card shadow-sm border border-stone/10 p-8 md:p-10">
        <div className="flex justify-center mb-8">
          <Logo height={44} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-charcoal mb-2">
            Welcome to Streak It
          </h1>
          <p className="text-stone text-sm">
            Practice microbiology through real virtual experiments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-charcoal mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-button border border-stone/20 bg-white text-charcoal placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-charcoal mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 pr-12 py-3 rounded-button border border-stone/20 bg-white text-charcoal placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone/60 hover:text-charcoal transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-button bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full bg-coral hover:bg-coral/90 disabled:bg-coral/60 text-white font-medium py-3 rounded-button transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-coral font-medium hover:underline"
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}
