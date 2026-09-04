import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { experiments } from '../data/experiments'
import { Clock, ArrowRight } from 'lucide-react'

export function ExperimentsPage() {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Experiments</h1>
          <p className="text-stone">
            Practice core microbiology techniques through guided virtual labs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              className="bg-[#FDFBF7] rounded-card border border-stone/10 p-6 flex flex-col transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    experiment.difficulty === 'Beginner'
                      ? 'bg-green-50 text-green-700'
                      : experiment.difficulty === 'Intermediate'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                  }`}
                >
                  {experiment.difficulty}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone">
                  <Clock size={14} />
                  {experiment.time}
                </div>
              </div>

              <h2 className="text-xl font-semibold text-charcoal mb-2">
                {experiment.title}
              </h2>
              <p className="text-sm text-stone mb-6 flex-1">
                {experiment.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-stone/10">
                <span className="text-xs text-stone">
                  {experiment.steps.length} steps
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/lab/${experiment.slug}`)}
                  className="flex items-center gap-2 bg-coral hover:bg-coral/90 text-white text-sm font-medium px-5 py-2.5 rounded-button transition-colors"
                >
                  Start
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
