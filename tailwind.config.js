/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nitro: {
          bg: '#0a0d14',
          card: '#111726',
          cardHover: '#161f33',
          border: '#1e293b',
          red: '#ff2e4d',
          cyan: '#00e5ff',
          green: '#00f59b',
          purple: '#b800ff',
          gold: '#ffb703',
          dark: '#07090e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Rajdhani', 'sans-serif']
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(255, 46, 77, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.4)',
        'glow-green': '0 0 20px rgba(0, 245, 155, 0.4)',
        'glow-purple': '0 0 20px rgba(184, 0, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
