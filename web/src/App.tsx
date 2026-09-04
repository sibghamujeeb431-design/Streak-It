import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingFlow } from './pages/OnboardingFlow'
import { DashboardPage } from './pages/DashboardPage'
import { ExperimentsPage } from './pages/ExperimentsPage'
import { AiLabPage } from './pages/AiLabPage'
import { ProgressPage } from './pages/ProgressPage'
import { GramStainingLab } from './pages/lab/GramStainingLab'
import { StreakPlateLab } from './pages/lab/StreakPlateLab'
import { AstLab } from './pages/lab/AstLab'
import { SerialDilutionLab } from './pages/lab/SerialDilutionLab'
import { BiochemicalTestingLab } from './pages/lab/BiochemicalTestingLab'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<AuthPage />} />
      <Route
        path="/onboarding/questions"
        element={
          <ProtectedRoute>
            <OnboardingFlow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/experiments"
        element={
          <ProtectedRoute>
            <ExperimentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-lab"
        element={
          <ProtectedRoute>
            <AiLabPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/gram-staining"
        element={
          <ProtectedRoute>
            <GramStainingLab />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/streak-plate"
        element={
          <ProtectedRoute>
            <StreakPlateLab />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/ast"
        element={
          <ProtectedRoute>
            <AstLab />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/serial-dilution"
        element={
          <ProtectedRoute>
            <SerialDilutionLab />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/biochemical-testing"
        element={
          <ProtectedRoute>
            <BiochemicalTestingLab />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
