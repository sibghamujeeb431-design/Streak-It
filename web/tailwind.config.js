/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F5F0E8',
        coral: '#C96A45',
        teal: '#2E7D6E',
        charcoal: '#1E1B18',
        stone: '#6B6560',
        'coral-50': '#FDF3EE',
        surface: '#FDFBF7',
        bench: '#F7F5F2',
        'bench-back': '#FBFAF8',
        'bench-edge': '#E8E3DC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'button': '10px',
      },
      keyframes: {
        'bottle-press': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '40%': { transform: 'translateY(-6px) scale(1.04)' },
        },
        'bottle-drip': {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '30%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(26px)' },
        },
        'error-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-6px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
        'iris-open': {
          from: { opacity: '0', transform: 'scale(0.55)', filter: 'blur(10px)' },
          to: { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' },
        },
        'field-settle': {
          from: { opacity: '0', transform: 'scale(1.25)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'fade-rise': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ring-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        'bottle-press': 'bottle-press 420ms cubic-bezier(.34,1.4,.64,1)',
        'bottle-drip': 'bottle-drip 700ms ease-in forwards',
        'error-shake': 'error-shake 420ms ease-in-out',
        'iris-open': 'iris-open 620ms cubic-bezier(.22,.9,.28,1) forwards',
        'field-settle': 'field-settle 700ms 260ms ease-out forwards',
        'fade-rise': 'fade-rise 300ms ease-out',
        'ring-pulse': 'ring-pulse 900ms ease-in-out infinite',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}

