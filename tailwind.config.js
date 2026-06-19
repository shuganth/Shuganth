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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Refined Dark AI-Lab palette
        ink: '#08090d',
        base: '#0a0b0f',
        panel: '#0e1016',
        line: 'rgba(255,255,255,0.08)',
        indigo: '#6366F1',
        azure: '#3B82F6',
        violet: '#8B5CF6',
        ember: '#F97316',
        // legacy aliases kept so any stray utility classes still resolve
        blue: '#3B82F6',
        pink: '#8B5CF6',
        orange: '#F97316',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 20px 60px -20px rgba(0,0,0,0.8)',
        glow: '0 0 0 1px rgba(99,102,241,0.25), 0 20px 70px -20px rgba(99,102,241,0.45)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(120deg,#3B82F6 0%,#6366F1 45%,#8B5CF6 100%)',
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(0,-24px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
