import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface FeedbackBarProps {
  message: string
  type?: 'info' | 'success' | 'error'
}

export function FeedbackBar({ message, type = 'info' }: FeedbackBarProps) {
  const icons = {
    info: <Info size={18} className="text-teal" />,
    success: <CheckCircle2 size={18} className="text-teal" />,
    error: <AlertCircle size={18} className="text-coral" />,
  }

  const styles = {
    info: {
      container: 'bg-teal/[0.06] border-teal/15',
      accent: 'bg-teal',
      text: 'text-charcoal',
    },
    success: {
      container: 'bg-teal/[0.08] border-teal/15',
      accent: 'bg-teal',
      text: 'text-charcoal',
    },
    error: {
      container: 'bg-coral/[0.10] border-coral/20',
      accent: 'bg-coral',
      text: 'text-charcoal',
    },
  }

  const style = styles[type]

  return (
    <div
      className={`relative flex items-start gap-3 rounded-card border px-4 py-3.5 animate-fade-rise ${style.container}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <div
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${style.accent}`}
        aria-hidden="true"
      />
      <div className="shrink-0 ml-1 mt-0.5">{icons[type]}</div>
      <p className={`text-sm leading-relaxed ${style.text}`}>{message}</p>
    </div>
  )
}
