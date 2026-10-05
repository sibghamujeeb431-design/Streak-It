import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Logo } from '../components/Logo'
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { updateUser } = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    const { error } = await updateUser(newPassword)
    setIsSubmitting(false)

    if (error) {
      setError(error.message)
    } else {
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/onboarding', { replace: true })
      }, 2000)
    }
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
            Set new password
          </h1>
          <p className="text-stone text-sm">
            {isSuccess
              ? 'Your password has been updated successfully.'
              : 'Enter your new password below.'}
          </p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="text-green-600 mb-4" size={64} />
            <p className="text-charcoal font-medium">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-charcoal mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-charcoal mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={isSubmitting}
              className="w-full bg-coral hover:bg-coral/90 disabled:bg-coral/60 text-white font-medium py-3 rounded-button transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
