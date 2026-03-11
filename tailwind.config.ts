import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0f1e',
        surface: '#0f1a35',
        border: '#1e3055',
        accent: '#f59e0b',
        'accent-light': '#fcd34d',
        muted: '#4a6080',
        subtle: '#8aafcc',
      },
    },
  },
  plugins: [],
}

export default config
