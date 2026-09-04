import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, FlaskConical, MessageSquare, TrendingUp, ChevronDown, LogOut } from 'lucide-react'
import { Logo } from './Logo'
import { useAuth } from '../context/useAuth'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/experiments', label: 'Experiments', icon: FlaskConical },
  { path: '/ai-lab', label: 'AI Lab', icon: MessageSquare },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
]

export function Sidebar() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = user?.email?.split('@')[0] || 'Student Name'

  async function handleSignOut() {
    await signOut()
    navigate('/onboarding', { replace: true })
  }

  return (
    <aside className="w-60 min-h-screen bg-[#FAF7F2] border-r border-stone/10 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <Logo height={36} />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-coral-50 text-coral'
                  : 'text-stone hover:bg-stone/5 hover:text-charcoal'
              }`
            }
          >
            <item.icon size={20} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-stone/10 relative">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="w-full flex items-center gap-3 p-3 rounded-button hover:bg-stone/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-stone/20 flex items-center justify-center text-stone">
            <span className="text-sm font-medium">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-charcoal truncate">
              {displayName}
            </p>
            <p className="text-xs text-stone">Microbiology Student</p>
          </div>
          <ChevronDown size={16} className={`text-stone transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>

        {menuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-card border border-stone/10 shadow-sm overflow-hidden">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-charcoal hover:bg-coral-50 hover:text-coral transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
