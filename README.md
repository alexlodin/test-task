# Weather (Expo / React Native)

Small app: enter a place name, pick one of two weather backends, see a normalized forecast. UI theme (colors, header glyph) follows the selected service.

## Run

```bash
npm install
npm start
```

Then open in Expo Go or press `i` / `a` for iOS / Android simulator.

## Tests

```bash
npm test
```

Uses Jest with `jest-expo`. If tests ever hang on your machine, the project sets `watchman: false` in `jest.config.js`.

## Code map

- **Services:** `src/weather/*` — `WeatherService` interface, Open-Meteo + wttr.in implementations, **`registry.ts`** to add or swap providers without touching the UI.
- **Theme per provider:** `src/theme/providerThemes.ts`
- **Validation:** `src/validation/locationValidation.ts`

## Stack

Expo SDK 55, React Native, TypeScript.
