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
        sumbawa: {
          gold:    { DEFAULT: '#C9A84C', light: '#E8C96A', dark: '#A07830' },
          maroon:  { DEFAULT: '#7B1C2E', light: '#9E2A40', dark: '#5A1020' },
          forest:  { DEFAULT: '#1E4D2B', light: '#2D6B3E', dark: '#143520' },
          ivory:   { DEFAULT: '#F5EDD6', light: '#FAF4E8', dark: '#E8D9B8' },
          copper:  { DEFAULT: '#B87333', light: '#D4924A' },
          cream:   { DEFAULT: '#FDF6E3' },
          charcoal:{ DEFAULT: '#2C2C2C' },
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        amiri:   ['var(--font-amiri)', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
