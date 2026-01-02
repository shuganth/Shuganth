/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Space Mono', 'monospace'],
        'accent': ['Bebas Neue', 'sans-serif'],
      },
      colors: {
        'void': '#0a0a0a',
        'obsidian': '#141414',
        'smoke': '#1a1a1a',
        'ember': '#ff4d00',
        'gold': '#ffd700',
        'platinum': '#e5e5e5',
        'mercury': '#888888',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 77, 0, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 77, 0, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
