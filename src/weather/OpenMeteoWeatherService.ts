import { describeOpenMeteoWeatherCode } from './openMeteoCodes';
import type { WeatherService } from './WeatherService';
import { WeatherServiceError, type NormalizedWeather } from './types';

type GeoJson = {
  results?: Array<{
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
};

type ForecastJson = {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
};

export class OpenMeteoWeatherService implements WeatherService {
  readonly id = 'open-meteo' as const;
  readonly displayName = 'Open-Meteo';

  async fetchWeather(locationQuery: string): Promise<NormalizedWeather> {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      locationQuery
    )}&count=1`;

    let geoRes: Response;
    try {
      geoRes = await fetch(geoUrl);
    } catch {
      throw new WeatherServiceError('Network error while geocoding', 'NETWORK');
    }
    if (!geoRes.ok) {
      throw new WeatherServiceError(`Geocoding failed (${geoRes.status})`, 'NETWORK');
    }

    let geo: GeoJson;
    try {
      geo = (await geoRes.json()) as GeoJson;
    } catch {
      throw new WeatherServiceError('Invalid geocoding response', 'PARSE');
    }

    const place = geo.results?.[0];
    if (!place) {
      throw new WeatherServiceError('Location not found', 'NOT_FOUND');
    }

    const { latitude, longitude, name, country } = place;
    const label = country ? `${name}, ${country}` : name;

    const forecastUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m';

    let fcRes: Response;
    try {
      fcRes = await fetch(forecastUrl);
    } catch {
      throw new WeatherServiceError('Network error while fetching forecast', 'NETWORK');
    }
    if (!fcRes.ok) {
      throw new WeatherServiceError(`Forecast failed (${fcRes.status})`, 'NETWORK');
    }

    let fc: ForecastJson;
    try {
      fc = (await fcRes.json()) as ForecastJson;
    } catch {
      throw new WeatherServiceError('Invalid forecast response', 'PARSE');
    }

    const cur = fc.current;
    if (
      cur?.temperature_2m === undefined ||
      cur?.weather_code === undefined
    ) {
      throw new WeatherServiceError('Incomplete forecast data', 'PARSE');
    }

    return {
      locationLabel: label,
      temperatureC: cur.temperature_2m,
      description: describeOpenMeteoWeatherCode(cur.weather_code),
      humidityPercent: cur.relative_humidity_2m,
      windSpeedKmh: cur.wind_speed_10m,
      providerId: this.id,
      fetchedAtIso: new Date().toISOString(),
    };
  }
}
