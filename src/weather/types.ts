export interface NormalizedWeather {
  locationLabel: string;
  temperatureC: number;
  description: string;
  humidityPercent?: number;
  windSpeedKmh?: number;
  providerId: string;
  fetchedAtIso: string;
}

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'NOT_FOUND' | 'NETWORK' | 'PARSE' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

export type WeatherServiceId = 'open-meteo' | 'wttr-in';
