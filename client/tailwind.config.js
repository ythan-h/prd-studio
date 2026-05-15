/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        surface: {
          base: '#07070e',
          primary: '#0d0d1a',
          secondary: '#121220',
          card: '#16162a',
          elevated: '#1c1c32',
          border: 'rgba(148, 163, 255, 0.08)',
          hover: 'rgba(148, 163, 255, 0.04)',
        },
        ink: {
          primary: '#eaeaf8',
          secondary: '#8888b8',
          muted: '#4a4a6a',
          accent: '#818cf8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)',
        'surface-gradient': 'linear-gradient(180deg, #0d0d1a 0%, #07070e 100%)',
        'glow-radial': 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 60%)',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(99, 102, 241, 0.2)',
        glow: '0 0 24px rgba(99, 102, 241, 0.25)',
        'glow-lg': '0 0 48px rgba(99, 102, 241, 0.3)',
        card: '0 2px 16px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 255, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(148, 163, 255, 0.1)',
        float: '0 20px 60px rgba(0, 0, 0, 0.8)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'fade-up': 'fadeUp 0.35s ease-out',
        'fade-up-slow': 'fadeUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'slide-in-left': 'slideInLeft 0.35s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
