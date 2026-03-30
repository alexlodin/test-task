import { OpenMeteoWeatherService } from '../weather/OpenMeteoWeatherService';
import { WeatherServiceError } from '../weather/types';

describe('OpenMeteoWeatherService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('returns normalized weather when APIs succeed', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: 'Paris',
              country: 'France',
              latitude: 48.8566,
              longitude: 2.3522,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 11.5,
            relative_humidity_2m: 72,
            weather_code: 2,
            wind_speed_10m: 18,
          },
        }),
      });

    const svc = new OpenMeteoWeatherService();
    const w = await svc.fetchWeather('Paris');

    expect(w.locationLabel).toBe('Paris, France');
    expect(w.temperatureC).toBe(11.5);
    expect(w.description).toBe('Partly cloudy');
    expect(w.humidityPercent).toBe(72);
    expect(w.windSpeedKmh).toBe(18);
    expect(w.providerId).toBe('open-meteo');
  });

  it('throws NOT_FOUND when geocoding has no results', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const svc = new OpenMeteoWeatherService();
    await expect(svc.fetchWeather('Nowhereville12345')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    } as WeatherServiceError);
  });
});
