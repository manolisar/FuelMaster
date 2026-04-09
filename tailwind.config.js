/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // ── fixed palette (accents) ────────────────────────────────────────
        hull: {
          950: '#050a12',
          900: '#080f1c',
          800: '#0d1829',
          700: '#132238',
          600: '#1b3050',
          500: '#234060',
        },
        sonar:       '#00e5ff',
        'sonar-dim': '#0090a8',
        ember:       '#ff9100',
        'ember-dim': '#a05800',
        readout:     '#00ff9d',
        'readout-dim':'#008f56',
        steel:       '#94a3b8',
        mist:        '#475569',

        // ── semantic tokens (switch with CSS custom properties) ────────────
        surface:      'var(--surface)',       // page background
        panel:        'var(--panel)',          // card / container background
        input:        'var(--input-bg)',       // input field background
        'panel-hover':'var(--panel-hover)',    // hover state for cards / tabs
        stroke:       'var(--stroke)',         // default border
        'stroke-dim': 'var(--stroke-dim)',     // stronger border / divider
        heading:      'var(--heading)',        // h1 / primary text
        body:         'var(--body)',           // regular body text
        dim:          'var(--dim)',            // muted / secondary text
        ghost:        'var(--ghost)',          // very faint text / placeholder
        trace:        'var(--trace)',          // calculation trace background
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'number-pop': 'numberPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                               to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0, 229, 255, 0.3)' },
          '50%':      { boxShadow: '0 0 20px rgba(0, 229, 255, 0.7)' },
        },
        numberPop: { from: { opacity: '0', transform: 'scale(0.85)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
