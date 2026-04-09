/**
 * Marine Fuel Weight-to-Volume Converter
 * Based on MARPOL/ASTM linearised thermal expansion model.
 *
 * Density is input in kg/m³ (as shown on BDNs and ASTM tables).
 * Mass is in metric tons (MT = t).
 *
 * Unit relationship:  1 t/m³ = 1000 kg/m³
 *
 * Formula:
 *   ρ_15  (t/m³)  = density15_kgm3 / 1000
 *   VCF           = 1 − α × (T_obs − 15)
 *   ρ_obs (t/m³)  = ρ_15 × VCF
 *   V_15  (m³)    = Mass / ρ_15
 *   V_obs (m³)    = Mass / ρ_obs
 */

export const FUEL_TYPES = {
  MGO: {
    id: 'MGO',
    label: 'MGO',
    fullName: 'Marine Gas Oil',
    description: 'DMA / DMB distillate',
    alpha: 0.00086,
    densityRange: [820, 900],   // kg/m³
    accentClass: 'sonar',
  },
  HFO: {
    id: 'HFO',
    label: 'HFO',
    fullName: 'Heavy Fuel Oil',
    description: 'IFO 380 / IFO 180 residual',
    alpha: 0.00065,
    densityRange: [930, 1010],  // kg/m³
    accentClass: 'ember',
  },
  LSFO: {
    id: 'LSFO',
    label: 'LSFO',
    fullName: 'Low Sulphur Fuel Oil',
    description: 'VLSFO / ULSFO residual',
    alpha: 0.00069,
    densityRange: [900, 991],   // kg/m³
    accentClass: 'readout',
  },
  METHANOL: {
    id: 'METHANOL',
    label: 'Methanol',
    fullName: 'Methanol',
    description: 'Alternative marine fuel',
    alpha: 0.00118,
    densityRange: [780, 800],   // kg/m³
    accentClass: 'sonar',
  },
}

/**
 * @param {object} params
 * @param {number} params.mass           - Mass in metric tons (MT)
 * @param {number} params.density15      - Density at 15 °C in kg/m³  (as on BDN)
 * @param {number} params.tempObs        - Observed bunkering temperature in °C
 * @param {string} params.fuelType       - Key from FUEL_TYPES
 * @returns {{ vcf, densityObs_kgm3, densityObs_tm3, volume15, volumeObs, alpha }}
 */
export function convertFuel({ mass, density15, tempObs, fuelType }) {
  const fuel = FUEL_TYPES[fuelType]
  if (!fuel) throw new Error(`Unknown fuel type: ${fuelType}`)

  const alpha         = fuel.alpha
  const rho15_tm3     = density15 / 1000          // kg/m³ → t/m³
  const vcf           = 1 - alpha * (tempObs - 15)
  const rhoObs_tm3    = rho15_tm3 * vcf
  const rhoObs_kgm3   = rhoObs_tm3 * 1000
  const volume15      = mass / rho15_tm3
  const volumeObs     = mass / rhoObs_tm3

  return { vcf, densityObs_kgm3: rhoObs_kgm3, densityObs_tm3: rhoObs_tm3, volume15, volumeObs, alpha }
}

/**
 * Validate inputs — density15 expected in kg/m³.
 */
export function validateInputs({ mass, density15, tempObs }) {
  const errors = {}

  if (!mass || isNaN(mass) || mass <= 0) {
    errors.mass = 'Enter a positive mass value'
  }

  if (!density15 || isNaN(density15)) {
    errors.density15 = 'Enter a valid density'
  } else if (density15 < 600 || density15 > 1100) {
    errors.density15 = 'Density must be between 600 – 1100 kg/m³'
  }

  if (tempObs === '' || tempObs === null || isNaN(tempObs)) {
    errors.tempObs = 'Enter a bunkering temperature'
  } else if (tempObs < -10 || tempObs > 150) {
    errors.tempObs = 'Temperature must be between -10 and 150 °C'
  }

  return errors
}

export function getInputWarnings({ density15, fuelType }) {
  const warnings = {}
  const fuel = FUEL_TYPES[fuelType]

  if (
    fuel &&
    density15 !== '' &&
    density15 !== null &&
    !isNaN(density15) &&
    density15 >= 600 &&
    density15 <= 1100 &&
    (density15 < fuel.densityRange[0] || density15 > fuel.densityRange[1])
  ) {
    warnings.density15 = `Outside typical ${fuel.label} range: ${fuel.densityRange[0]} – ${fuel.densityRange[1]} kg/m³`
  }

  return warnings
}
