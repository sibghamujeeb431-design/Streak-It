import { DashboardLayout } from '../components/DashboardLayout'
import { useAuth } from '../context/useAuth'

export function DashboardPage() {
  const { profile } = useAuth()

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-charcoal mb-4">Dashboard</h1>
        <p className="text-stone mb-8">
          Welcome back. Your personalized microbiology learning hub is coming soon.
        </p>

        {profile && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FDFBF7] rounded-card p-5 border border-stone/10">
              <p className="text-xs text-stone uppercase tracking-wide mb-1">Level</p>
              <p className="text-lg font-semibold text-charcoal">
                {profile.microbiology_level || 'Not set'}
              </p>
            </div>
            <div className="bg-[#FDFBF7] rounded-card p-5 border border-stone/10">
              <p className="text-xs text-stone uppercase tracking-wide mb-1">Focus</p>
              <p className="text-lg font-semibold text-charcoal">
                {profile.focus_area || 'Not set'}
              </p>
            </div>
            <div className="bg-[#FDFBF7] rounded-card p-5 border border-stone/10">
              <p className="text-xs text-stone uppercase tracking-wide mb-1">Default Mode</p>
              <p className="text-lg font-semibold text-charcoal">
                {profile.default_mode || 'Not set'}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
