import { FUEL_TYPES } from '../utils/conversion'

// Accent keys map to CSS variable names defined per-theme in index.css
const ACCENT_VAR = {
  sonar:   { color: '--accent-sonar',   border: '--accent-sonar-border' },
  ember:   { color: '--accent-ember',   border: '--accent-ember-border' },
  readout: { color: '--accent-readout', border: '--accent-readout-border' },
}

export default function FuelSelector({ selected, onChange }) {
  const fuels = Object.values(FUEL_TYPES)

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono uppercase tracking-widest text-dim">
        Fuel Type
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {fuels.map((fuel) => {
          const isActive = selected === fuel.id
          const av       = ACCENT_VAR[fuel.accentClass] ?? ACCENT_VAR.sonar
          const color    = `var(${av.color})`
          const border   = `var(${av.border})`

          return (
            <button
              key={fuel.id}
              onClick={() => onChange(fuel.id)}
              style={isActive ? { borderColor: border, color, backgroundColor: 'color-mix(in srgb, currentColor 8%, transparent)' } : {}}
              className={`
                relative flex flex-col items-start gap-1 p-3 rounded-lg border
                transition-all duration-200
                ${isActive
                  ? 'border-transparent'
                  : 'border-stroke text-body bg-input hover:border-stroke-dim hover:bg-panel-hover'
                }
              `}
            >
              {isActive && (
                <span
                  className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}

              <span className="font-display text-2xl leading-none tracking-wide">
                {fuel.label}
              </span>
              <span className="text-[10px] font-mono leading-tight opacity-60 text-left">
                {fuel.description}
              </span>

              {isActive && (
                <span className="text-[10px] font-mono mt-0.5 opacity-70">
                  α = {fuel.alpha.toFixed(5)} /°C
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
