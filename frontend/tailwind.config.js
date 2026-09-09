/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm obsidian surfaces (replacing cold generic slate)
        obsidian: {
          950: '#090a0c', // deepest background
          900: '#101216', // card base
          850: '#16191f', // elevated card
          800: '#1d212a', // hover state
          750: '#252a36', // highlighted surface
          700: '#323847', // border medium
          600: '#485063', // border strong
          500: '#646e85', // text muted
        },
        // Warm living vitality accents (vital human medical care)
        vital: {
          coral: '#f45d48',    // Primary human heartbeat/action accent
          rose: '#fb7185',     // Soft maternal glow
          amber: '#f59e0b',    // Observational / suspect alert
          ochre: '#d97706',    // Secondary alert
          sage: '#22c55e',     // Healing / reassuring normal
          eucalyptus: '#10b981',
          sand: '#e8ded2',     // Human editorial highlight
          terracotta: '#c85a44'
        },
        // Legacy bridge mappings
        brand: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d3cf',
          300: '#f4ada5',
          400: '#eb7d70',
          500: '#f45d48',
          600: '#dc442e',
          700: '#b83420',
          800: '#982e1e',
          900: '#7e2b1e',
        },
        risk: {
          normal: '#22c55e',
          suspect: '#f59e0b',
          pathological: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'warm-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 1px rgba(0, 0, 0, 0.2)',
        'warm-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'vital-glow': '0 0 25px -3px rgba(244, 93, 72, 0.25)',
      }
    },
  },
  plugins: [],
}
