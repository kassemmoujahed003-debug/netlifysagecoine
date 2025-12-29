import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#182231',
        'secondary-surface': '#355060',
        'accent': '#CFE2F3',
        'base-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        alexandria: ['Alexandria', 'Inter', 'system-ui', 'sans-serif'],
        'dg-modal3at': ['DG-Modal3at', 'Alexandria', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid typography using clamp
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.35vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.6vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.75rem + 2.5vw, 3rem)',
        'fluid-5xl': 'clamp(2.75rem, 2rem + 3.75vw, 4rem)',
        'fluid-6xl': 'clamp(3rem, 2rem + 5vw, 5rem)',
        'fluid-7xl': 'clamp(3.5rem, 2.25rem + 6.25vw, 6rem)',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      screens: {
        'xs': '375px',
        'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
        'mouse': { 'raw': '(hover: hover) and (pointer: fine)' },
      },
      animation: {
        'slide-in': 'slideInFromRight 0.3s ease-out forwards',
        'slide-out': 'slideOutToRight 0.3s ease-in forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-out': 'fadeOut 0.2s ease-in forwards',
      },
      keyframes: {
        slideInFromRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutToRight: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config

