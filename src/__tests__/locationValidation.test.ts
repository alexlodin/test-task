import { validateLocationInput } from '../validation/locationValidation';

describe('validateLocationInput', () => {
  it('rejects empty and too-short input', () => {
    expect(validateLocationInput('').ok).toBe(false);
    expect(validateLocationInput('   ').ok).toBe(false);
    expect(validateLocationInput('a').ok).toBe(false);
  });

  it('returns trimmed value when valid', () => {
    const r = validateLocationInput('  Paris  ');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('Paris');
  });

  it('rejects overly long input', () => {
    const r = validateLocationInput('a'.repeat(81));
    expect(r.ok).toBe(false);
  });

  it('rejects disallowed characters', () => {
    expect(validateLocationInput('Paris@').ok).toBe(false);
    expect(validateLocationInput('City#1').ok).toBe(false);
  });

  it('allows common place-name punctuation', () => {
    expect(validateLocationInput("St. John's").ok).toBe(true);
    expect(validateLocationInput('São Paulo').ok).toBe(true);
    expect(validateLocationInput('Wilkes-Barre').ok).toBe(true);
  });
});
