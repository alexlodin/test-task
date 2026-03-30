import { OpenMeteoWeatherService } from './OpenMeteoWeatherService';
import { WttrInWeatherService } from './WttrInWeatherService';
import type { WeatherService } from './WeatherService';
import type { WeatherServiceId } from './types';

export const DEFAULT_WEATHER_SERVICE_ID: WeatherServiceId = 'open-meteo';

const factories: Record<WeatherServiceId, () => WeatherService> = {
  'open-meteo': () => new OpenMeteoWeatherService(),
  'wttr-in': () => new WttrInWeatherService(),
};

export function createWeatherService(id: WeatherServiceId): WeatherService {
  return factories[id]();
}

export function listWeatherServiceIds(): WeatherServiceId[] {
  return Object.keys(factories) as WeatherServiceId[];
}

export function getWeatherServiceMeta(
  id: WeatherServiceId
): Pick<WeatherService, 'id' | 'displayName'> {
  const instance = factories[id]();
  return { id: instance.id, displayName: instance.displayName };
}
