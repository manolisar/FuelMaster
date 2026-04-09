# FuelMaster

FuelMaster is a small React calculator for converting marine fuel mass in metric tons into observed volume using a linearised ASTM D1250-style volume correction factor.

## Development

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

## Production

Create a production build with:

```bash
npm run build
```

The app is configured for GitHub Pages under `/FuelMaster/`, so the generated asset paths assume that repository name.

## Quality Checks

Run the available static checks with:

```bash
npm run lint
npm run build
```

## Calculator Inputs

- Fuel type
- Mass in metric tons
- Density at 15 C in kg/m3
- Observed bunkering temperature in C

Fuel-specific density bands are treated as guidance, not hard validation failures.
