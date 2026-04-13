import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'lx-red': '#C41230',
        'lx-dark': '#1a1a1a',
        'lx-mid': '#4a4a4a',
        'lx-light': '#f5f5f3',
        'lx-white': '#ffffff',
        'lx-border': '#e5e5e5',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      letterSpacing: {
        eyebrow: '0.14em',
      },
    },
  },
  plugins: [],
}

export default config
