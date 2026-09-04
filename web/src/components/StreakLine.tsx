interface StreakLineProps {
  className?: string
}

export function StreakLine({ className = '' }: StreakLineProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="streakGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C96A45" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#C96A45" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2E7D6E" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d="M-40 720 C 240 640, 560 560, 760 480 S 1120 360, 1480 160"
        stroke="url(#streakGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
