import {
  createWeatherService,
  listWeatherServiceIds,
  DEFAULT_WEATHER_SERVICE_ID,
} from '../weather/registry';

describe('weather registry', () => {
  it('lists known provider ids', () => {
    const ids = listWeatherServiceIds();
    expect(ids).toContain('open-meteo');
    expect(ids).toContain('wttr-in');
  });

  it('creates services for each id', () => {
    for (const id of listWeatherServiceIds()) {
      const svc = createWeatherService(id);
      expect(svc.id).toBe(id);
      expect(svc.displayName.length).toBeGreaterThan(0);
    }
  });

  it('defaults to open-meteo in app hook via constant', () => {
    expect(DEFAULT_WEATHER_SERVICE_ID).toBe('open-meteo');
  });
});
