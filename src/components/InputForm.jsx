import { useState } from 'react'
import { FUEL_TYPES } from '../utils/conversion'

function Field({ id, label, unit, value, onChange, onBlur, error, warning, hint, showError, step, min, max, placeholder }) {
  const showWarning = showError && !error && !!warning

  return (
    <div className="flex flex-col gap-1">
      {/* Label row — fixed one-line layout */}
      <label htmlFor={id} className="text-xs font-mono uppercase tracking-widest text-dim whitespace-nowrap">
        {label}
      </label>

      {/* Input wrapper */}
      <div className={`
        relative flex items-center rounded-lg border overflow-hidden transition-all duration-200
        ${showError && error
          ? 'border-ember/70 bg-input shadow-[0_0_14px_rgba(255,145,0,0.18)]'
          : 'border-stroke bg-input focus-within:border-sonar/50 focus-within:shadow-[0_0_12px_rgba(0,229,255,0.12)]'
        }
      `}>
        <input
          id={id}
          type="number"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="
            min-w-0 flex-1 bg-transparent px-4 py-3 text-right font-mono text-lg text-body
            placeholder:text-ghost focus:outline-none focus:text-heading
            transition-colors duration-150
          "
        />
        <span className="pr-4 font-mono text-sm text-dim select-none whitespace-nowrap">
          {unit}
        </span>
      </div>

      {/* Hint / error — always occupies space to prevent layout shift */}
      <div className="min-h-[14px]">
        {showError && error
          ? <p className="text-[10px] font-mono text-ember animate-fade-in">{error}</p>
          : showWarning
          ? <p className="text-[10px] font-mono text-amber-300 animate-fade-in">{warning}</p>
          : hint
            ? <p className="text-[10px] font-mono text-ghost">{hint}</p>
            : null}
      </div>
    </div>
  )
}

export default function InputForm({ values, onChange, errors, warnings }) {
  const [touched, setTouched] = useState({})
  const fuel = FUEL_TYPES[values.fuelType]

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  return (
    <div className="space-y-2">
      {/* Section divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-stroke" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-dim">Parameters</span>
        <div className="flex-1 h-px bg-stroke" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
        <Field
          id="mass"
          label="Mass"
          unit="MT"
          value={values.mass}
          onChange={(v) => onChange('mass', v)}
          onBlur={() => touch('mass')}
          error={errors.mass}
          showError={!!touched.mass}
          placeholder="0.000"
          step="0.001"
          min="0"
          hint="metric tons"
        />

        <Field
          id="density15"
          label="Density @ 15 °C"
          unit="kg/m³"
          value={values.density15}
          onChange={(v) => onChange('density15', v)}
          onBlur={() => touch('density15')}
          error={errors.density15}
          warning={warnings.density15}
          showError={!!touched.density15}
          placeholder={fuel ? `${fuel.densityRange[0]}–${fuel.densityRange[1]}` : '000'}
          step="1"
          min="600"
          max="1100"
          hint={fuel ? `typical ${fuel.label} range` : ''}
        />

        <Field
          id="tempObs"
          label="Bunkering Temp"
          unit="°C"
          value={values.tempObs}
          onChange={(v) => onChange('tempObs', v)}
          onBlur={() => touch('tempObs')}
          error={errors.tempObs}
          showError={!!touched.tempObs}
          placeholder="0.0"
          step="0.1"
          min="-10"
          max="150"
          hint="-10 to 150 °C"
        />
      </div>
    </div>
  )
}
