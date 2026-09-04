import type { ReactNode } from 'react'

interface BenchSurfaceProps {
  children: ReactNode
  className?: string
}

export function BenchSurface({ children, className = '' }: BenchSurfaceProps) {
  return (
    <div
      className={`relative rounded-card overflow-hidden bg-bench-back ${className}`}
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #FFFFFF 0%, #FBFAF8 45%, #F1EEE9 100%)',
      }}
    >
      <div
        className="absolute left-0 right-0 bottom-0 h-[42%]"
        style={{
          background:
            'linear-gradient(180deg, #F7F5F2 0%, #F2EFEA 60%, #EAE5DE 100%)',
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-[38%] h-16 blur-md pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.035) 100%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_90px_rgba(30,27,24,0.05)]" />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  )
}
