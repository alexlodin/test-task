import { getThemeForProvider, providerThemes } from '../theme/providerThemes';

describe('providerThemes', () => {
  it('provides distinct palettes per service', () => {
    const a = providerThemes['open-meteo'];
    const b = providerThemes['wttr-in'];
    expect(a.background).not.toBe(b.background);
    expect(a.brandGlyph).not.toBe(b.brandGlyph);
  });

  it('getThemeForProvider returns stable theme', () => {
    expect(getThemeForProvider('open-meteo').accent).toBeTruthy();
  });
});
