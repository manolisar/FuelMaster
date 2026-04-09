import { useState } from 'react'

function Readout({ label, value, unit, accentClass, large = false, copyable = false }) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const accentMap = {
    sonar:   { varName: '--accent-sonar',   borderVar: '--accent-sonar-border' },
    ember:   { varName: '--accent-ember',   borderVar: '--accent-ember-border' },
    readout: { varName: '--accent-readout', borderVar: '--accent-readout-border' },
  }
  const a = accentMap[accentClass] ?? accentMap.sonar

  const handleCopy = async () => {
    if (!navigator.clipboard?.writeText) {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 1500)
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setCopyError(false)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
      setCopyError(true)
      setTimeout(() => setCopyError(false), 1500)
    }
  }

  const color  = `var(${a.varName})`
  const border = `var(${a.borderVar})`

  return (
    <div
      className="relative rounded-lg border p-4 animate-slide-up transition-colors duration-300 bg-panel"
      style={{ borderColor: border }}
    >
      {copyable && (
        <button
          onClick={handleCopy}
          title="Copy value"
          className="absolute top-2 right-2 text-[10px] font-mono text-dim hover:text-body transition-colors px-1.5 py-0.5 rounded border border-stroke hover:border-stroke-dim"
        >
          {copied ? 'copied' : copyError ? 'failed' : 'copy'}
        </button>
      )}

      <div
        className="text-[10px] font-mono uppercase tracking-widest mb-2 opacity-70"
        style={{ color }}
      >
        {label}
      </div>

      <div
        className={`font-mono font-medium animate-number-pop ${large ? 'text-4xl' : 'text-2xl'}`}
        style={{ color }}
      >
        {value}
        <span className="text-base ml-1.5 font-normal opacity-60">{unit}</span>
      </div>
    </div>
  )
}

function FormulaTrace({ mass, density15_kgm3, densityObs_kgm3, densityObs_tm3, vcf, volumeObs, alpha }) {
  const rho15_tm3 = density15_kgm3 / 1000
  const rows = [
    {
      label: 'ρ₁₅',
      expr:   `${density15_kgm3.toFixed(1)} kg/m³ ÷ 1000`,
      result: `= ${rho15_tm3.toFixed(4)} t/m³`,
    },
    {
      label: 'VCF',
      expr:   `1 − ${alpha.toFixed(5)} × (T − 15)`,
      result: `= ${vcf.toFixed(6)}`,
    },
    {
      label: 'ρ @ T',
      expr:   `${rho15_tm3.toFixed(4)} × ${vcf.toFixed(6)}`,
      result: `= ${densityObs_tm3.toFixed(4)} t/m³  (${densityObs_kgm3.toFixed(2)} kg/m³)`,
    },
    {
      label: 'Volume',
      expr:   `${mass.toFixed(3)} MT ÷ ${densityObs_tm3.toFixed(4)}`,
      result: `= ${volumeObs.toFixed(3)} m³`,
    },
  ]

  return (
    <div className="rounded-lg border border-stroke bg-trace p-4 space-y-1.5 transition-colors duration-300">
      <div className="text-[10px] font-mono uppercase tracking-widest text-dim mb-3">
        Calculation Trace
      </div>
      {rows.map(({ label, expr, result }) => (
        <div key={label} className="grid grid-cols-[4.5rem_1fr_auto] gap-2 items-baseline text-xs font-mono">
          <span className="text-dim">{label}</span>
          <span className="text-ghost truncate">{expr}</span>
          <span className="text-body">{result}</span>
        </div>
      ))}
    </div>
  )
}

export default function ResultsPanel({ result, inputs }) {
  if (!result) return null

  const { vcf, densityObs_kgm3, densityObs_tm3, volumeObs, alpha } = result
  const { mass, density15 } = inputs
  const tempDelta  = parseFloat(inputs.tempObs) - 15
  const vcfLabel   = `VCF · ΔT ${tempDelta > 0 ? '+' : ''}${tempDelta.toFixed(1)} °C`

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Section divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-stroke" />
        <span
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: 'var(--accent-sonar)' }}
        >
          Results
        </span>
        <div className="flex-1 h-px bg-stroke" />
      </div>

      {/* Three equal readout cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Readout
          label="Volume @ Observed Temp"
          value={volumeObs.toFixed(3)}
          unit="m³"
          accentClass="readout"
          copyable
        />
        <Readout
          label={vcfLabel}
          value={vcf.toFixed(6)}
          unit=""
          accentClass="sonar"
        />
        <Readout
          label="Density @ Observed Temp"
          value={densityObs_kgm3.toFixed(2)}
          unit="kg/m³"
          accentClass="ember"
        />
      </div>

      {/* Calculation trace */}
      <FormulaTrace
        mass={parseFloat(mass)}
        density15_kgm3={parseFloat(density15)}
        densityObs_kgm3={densityObs_kgm3}
        densityObs_tm3={densityObs_tm3}
        vcf={vcf}
        volumeObs={volumeObs}
        alpha={alpha}
      />
    </div>
  )
}
