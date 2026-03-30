import type { WeatherService } from './WeatherService';
import { WeatherServiceError, type NormalizedWeather } from './types';

type WttrJson = {
  current_condition?: Array<{
    temp_C?: string;
    humidity?: string;
    weatherDesc?: Array<{ value?: string }>;
    windspeedKmph?: string;
  }>;
  nearest_area?: Array<{ areaName?: Array<{ value?: string }> }>;
};

export class WttrInWeatherService implements WeatherService {
  readonly id = 'wttr-in' as const;
  readonly displayName = 'wttr.in';

  async fetchWeather(locationQuery: string): Promise<NormalizedWeather> {
    const path = encodeURIComponent(locationQuery.trim()).replace(/%20/g, '+');
    const url = `https://wttr.in/${path}?format=j1`;

    let res: Response;
    try {
      res = await fetch(url, {
        headers: {
          'User-Agent': 'WeatherApp/1.0 (React Native; educational)',
        },
      });
    } catch {
      throw new WeatherServiceError('Network error (wttr.in)', 'NETWORK');
    }

    if (!res.ok) {
      throw new WeatherServiceError(`wttr.in returned ${res.status}`, 'NETWORK');
    }

    let data: WttrJson;
    try {
      data = (await res.json()) as WttrJson;
    } catch {
      throw new WeatherServiceError('Invalid wttr.in response', 'PARSE');
    }

    const cur = data.current_condition?.[0];
    if (!cur?.temp_C) {
      throw new WeatherServiceError('Location not found or no data', 'NOT_FOUND');
    }

    const areaName = data.nearest_area?.[0]?.areaName?.[0]?.value;
    const label = areaName ? `${areaName}` : locationQuery.trim();

    const temp = Number.parseFloat(cur.temp_C);
    if (Number.isNaN(temp)) {
      throw new WeatherServiceError('Could not parse temperature', 'PARSE');
    }

    const desc = cur.weatherDesc?.[0]?.value ?? 'Unknown';
    const hum = cur.humidity !== undefined ? Number.parseInt(cur.humidity, 10) : undefined;
    const wind =
      cur.windspeedKmph !== undefined
        ? Number.parseFloat(cur.windspeedKmph)
        : undefined;

    return {
      locationLabel: label,
      temperatureC: temp,
      description: desc,
      humidityPercent: hum !== undefined && !Number.isNaN(hum) ? hum : undefined,
      windSpeedKmh: wind !== undefined && !Number.isNaN(wind) ? wind : undefined,
      providerId: this.id,
      fetchedAtIso: new Date().toISOString(),
    };
  }
}
