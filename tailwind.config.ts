import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        aura: {
          bg:        '#0d0b14',
          bg2:       '#13101e',
          bg3:       '#1a1628',
          bg4:       '#221d34',
          card:      '#1a1628',
          card2:     '#221d34',
          card3:     '#2a2442',
          purple:    '#9b8ae8',
          purple2:   '#c4b8f7',
          purple3:   '#6d5dbd',
          purpleDim: '#3d3466',
          lavender:  '#c9bfef',
          lavender2: '#e8e4fa',
          pink:      '#e8a4c8',
          pink2:     '#f5cce4',
          pinkDim:   '#6b3a54',
          gold:      '#e8c97a',
          gold2:     '#f5e4b0',
          goldDim:   '#6b5020',
          teal:      '#7dc9c0',
          teal2:     '#b0e8e4',
          text:      '#f0eefa',
          text2:     '#c8bfe8',
          text3:     '#8a7fb0',
          text4:     '#5a5278',
        },
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #6d5dbd 0%, #3d3466 100%)',
        'gradient-pink': 'linear-gradient(135deg, #6b3a54 0%, #3d3466 100%)',
        'gradient-card': 'linear-gradient(135deg, #1a1628 0%, #2a2442 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(155,138,232,0.15) 0%, transparent 70%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'glow-purple': '0 0 24px rgba(155,138,232,0.25)',
        'glow-pink': '0 0 24px rgba(232,164,200,0.2)',
        'glow-gold': '0 0 16px rgba(232,201,122,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(155,138,232,0.3)' },
          '50%': { boxShadow: '0 0 28px rgba(155,138,232,0.6)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.2)', opacity: '0.15' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'xp-pop': {
          '0%': { transform: 'translate(-50%, -50%) scale(0.5)', opacity: '0' },
          '50%': { transform: 'translate(-50%, -60%) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -80%) scale(1)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'xp-pop': 'xp-pop 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
