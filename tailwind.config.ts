import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f172a',
        surface: '#1e293b',
        border: '#334155',
        accent: '#6366f1',
        'accent-light': '#a5b4fc',
        muted: '#64748b',
        subtle: '#94a3b8',
      },
    },
  },
  plugins: [],
}

export default config
