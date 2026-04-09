import { useState, useMemo, useCallback, useEffect } from 'react'
import FuelSelector from './components/FuelSelector'
import InputForm from './components/InputForm'
import ResultsPanel from './components/ResultsPanel'
import { convertFuel, getInputWarnings, validateInputs } from './utils/conversion'

const INITIAL_VALUES = {
  fuelType: 'MGO',
  mass: '',
  density15: '',
  tempObs: '',
}

function AnchorIcon({ className, ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="5" r="2" />
      <line x1="12" y1="7" x2="12" y2="19" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      <line x1="5" y1="7" x2="19" y2="7" />
    </svg>
  )
}

function SunIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [resetCount, setResetCount] = useState(0)

  // Sync theme class onto <html> so CSS variables cascade everywhere (incl. body bg)
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('theme-light')
    } else {
      document.documentElement.classList.add('theme-light')
    }
  }, [isDark])

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleFuelChange = useCallback((fuelType) => {
    setValues((prev) => ({ ...prev, fuelType }))
  }, [])

  const handleReset = () => {
    setValues(INITIAL_VALUES)
    setResetCount((count) => count + 1)
  }

  const parsed = useMemo(() => ({
    mass:      parseFloat(values.mass),
    density15: parseFloat(values.density15),
    tempObs:   parseFloat(values.tempObs),
    fuelType:  values.fuelType,
  }), [values])

  const errors = useMemo(() => validateInputs(parsed), [parsed])
  const warnings = useMemo(() => getInputWarnings(parsed), [parsed])

  const isValid = Object.keys(errors).length === 0 &&
    values.mass !== '' && values.density15 !== '' && values.tempObs !== ''

  const result = useMemo(() => {
    if (!isValid) return null
    try { return convertFuel(parsed) } catch { return null }
  }, [isValid, parsed])

  return (
    <div className="relative min-h-dvh bg-surface bg-grid overflow-x-hidden transition-colors duration-300">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      {/* Radial glow at top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at center top, var(--glow-top) 0%, transparent 70%)`,
          opacity: 'var(--glow-opacity)',
        }}
      />

      <div className="relative z-20 max-w-3xl mx-auto px-4 py-10 sm:py-16">

        {/* ── Header ── */}
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <AnchorIcon className="w-7 h-7 opacity-70 flex-shrink-0" style={{ color: 'var(--accent-sonar)' }} />
              <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-heading leading-none">
                FUEL<span style={{ color: 'var(--accent-sonar)' }}>MASTER</span>
              </h1>
            </div>
            <p className="text-xs font-mono text-dim tracking-widest uppercase ml-10">
              Marine Fuel Weight → Volume Converter
            </p>
          </div>

          {/* Controls: theme toggle + reset */}
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={() => setIsDark((d) => !d)}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-dim hover:text-sonar border border-stroke hover:border-sonar/40 px-3 py-1.5 rounded transition-all duration-200"
            >
              {isDark
                ? <SunIcon className="w-3.5 h-3.5" />
                : <MoonIcon className="w-3.5 h-3.5" />
              }
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={handleReset}
              className="text-[10px] font-mono uppercase tracking-widest text-dim hover:text-sonar border border-stroke hover:border-sonar/40 px-3 py-1.5 rounded transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </header>

        {/* ── Main Card ── */}
        <main className="rounded-xl border border-stroke bg-panel backdrop-blur-sm card-shadow p-6 space-y-6 transition-colors duration-300">

          <FuelSelector selected={values.fuelType} onChange={handleFuelChange} />

          <InputForm key={resetCount} values={values} onChange={handleChange} errors={errors} warnings={warnings} />

          <ResultsPanel result={result} inputs={values} />

          {!result && (
            <p className="text-center text-xs font-mono text-ghost pt-2 animate-fade-in">
              Enter mass, density at 15 °C, and bunkering temperature to calculate
            </p>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="mt-8 text-center space-y-1">
          <p className="text-[10px] font-mono text-ghost uppercase tracking-widest">
            VCF based on ASTM D1250 linearised model · Density reference at 15 °C (MARPOL)
          </p>
          <p className="text-[10px] font-mono text-ghost">
            α values — MGO 0.00086 · HFO 0.00065 · LSFO 0.00069 · Methanol 0.00118 per °C
          </p>
        </footer>
      </div>
    </div>
  )
}
