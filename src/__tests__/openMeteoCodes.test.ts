import { describeOpenMeteoWeatherCode } from '../weather/openMeteoCodes';

describe('describeOpenMeteoWeatherCode', () => {
  it('maps known WMO codes', () => {
    expect(describeOpenMeteoWeatherCode(0)).toBe('Clear sky');
    expect(describeOpenMeteoWeatherCode(95)).toBe('Thunderstorm');
  });

  it('falls back for unknown codes', () => {
    expect(describeOpenMeteoWeatherCode(9999)).toBe('Weather code 9999');
  });
});
