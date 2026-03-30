import type { NormalizedWeather, WeatherServiceId } from './types';

/**
 * All weather backends implement this contract. The UI only consumes
 * {@link NormalizedWeather}, so swapping or adding providers does not require
 * screen changes—only a new class and a registry entry.
 */
export interface WeatherService {
  readonly id: WeatherServiceId;
  readonly displayName: string;
  fetchWeather(locationQuery: string): Promise<NormalizedWeather>;
}
