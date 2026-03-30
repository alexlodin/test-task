import { WttrInWeatherService } from '../weather/WttrInWeatherService';

describe('WttrInWeatherService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('parses wttr.in JSON into normalized weather', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current_condition: [
          {
            temp_C: '14',
            humidity: '65',
            weatherDesc: [{ value: 'Partly cloudy' }],
            windspeedKmph: '22',
          },
        ],
        nearest_area: [{ areaName: [{ value: 'Berlin' }] }],
      }),
    });

    const svc = new WttrInWeatherService();
    const w = await svc.fetchWeather('Berlin');

    expect(w.locationLabel).toBe('Berlin');
    expect(w.temperatureC).toBe(14);
    expect(w.description).toBe('Partly cloudy');
    expect(w.humidityPercent).toBe(65);
    expect(w.windSpeedKmh).toBe(22);
    expect(w.providerId).toBe('wttr-in');
  });
});
