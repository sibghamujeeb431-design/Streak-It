interface LogoProps {
  className?: string
  height?: number
}

export function Logo({ className = '', height = 40 }: LogoProps) {
  return (
    <img
      src="/streak-it-logo.jpeg"
      alt="Streak It"
      height={height}
      className={`object-contain ${className}`}
      style={{ height }}
    />
  )
}
