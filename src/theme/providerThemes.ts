import type { WeatherServiceId } from '../weather/types';

/**
 * Visual scheme per selected backend — swap colors, glyphs.
 */
export interface ProviderTheme {
  background: string;
  surface: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  toggleActive: string;
  toggleInactive: string;
  cardBorder: string;
  statusBarStyle: 'light' | 'dark';
  brandGlyph: string;
}

export const providerThemes: Record<WeatherServiceId, ProviderTheme> = {
  'open-meteo': {
    background: '#0c4a6e',
    surface: '#075985',
    primaryText: '#f0f9ff',
    secondaryText: '#bae6fd',
    accent: '#38bdf8',
    toggleActive: '#0284c7',
    toggleInactive: '#164e63',
    cardBorder: '#38bdf8',
    statusBarStyle: 'light',
    brandGlyph: '🌤️',
  },
  'wttr-in': {
    background: '#1e1b2e',
    surface: '#2d2640',
    primaryText: '#faf5ff',
    secondaryText: '#c4b5fd',
    accent: '#a78bfa',
    toggleActive: '#7c3aed',
    toggleInactive: '#4c1d95',
    cardBorder: '#8b5cf6',
    statusBarStyle: 'light',
    brandGlyph: '📡',
  },
};

export function getThemeForProvider(id: WeatherServiceId): ProviderTheme {
  return providerThemes[id];
}
