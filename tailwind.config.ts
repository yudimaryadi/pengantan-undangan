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
        // ── Soft Romantic Wedding Palette ──────────────────────────────
        w: {
          // Backgrounds — warm ivory & blush
          bg:       '#FDF8F5',   // warm ivory — main background
          bgAlt:    '#FAF0F0',   // very light blush — alternate sections
          surface:  '#FFFFFF',   // pure white — cards
          overlay:  '#F5E8E8',   // soft blush overlay

          // Primary — Dusty Rose (sophisticated, not childish)
          rose:     { DEFAULT: '#C4788A', light: '#D9A0AE', dark: '#A05A6E', pale: '#F2DDE2' },

          // Secondary — Warm Mauve
          mauve:    { DEFAULT: '#9B7285', light: '#BFA0AE', dark: '#7A5568' },

          // Accent — Champagne Gold
          gold:     { DEFAULT: '#B8965A', light: '#D4B47A', dark: '#8C7040', pale: '#F5ECD8' },

          // Text
          ink:      '#2C1F24',   // near-black with warm undertone — headings
          body:     '#5C4048',   // warm dark brown — body text
          muted:    '#9C7A84',   // muted rose-grey — secondary text
          subtle:   '#C4A8B0',   // very muted — captions

          // Borders
          border:   '#E8D4D8',   // soft pink border
          borderAlt:'#D4B8C0',   // slightly darker border
          line:     '#F0E0E4',   // very light divider line
        },
      },
      fontFamily: {
        poppins:   ['var(--font-poppins)', 'sans-serif'],
        amiri:     ['var(--font-amiri)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 3s linear infinite',
        'fade-up':    'fadeUp 0.8s ease forwards',
        'petal-fall': 'petalFall 4s ease-in forwards',
        'sway':       'sway 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        petalFall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '0' },
          '10%':  { opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':      { transform: 'rotate(3deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'rose-fade': 'linear-gradient(180deg, #FDF8F5 0%, #FAF0F0 100%)',
      },
      boxShadow: {
        'soft':    '0 2px 20px rgba(196, 120, 138, 0.08)',
        'card':    '0 4px 32px rgba(196, 120, 138, 0.10)',
        'rose':    '0 8px 40px rgba(196, 120, 138, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
