export type LocationValidationResult =
  | { ok: true; value: string }
  | { ok: false; message: string };

const MIN_LEN = 2;
const MAX_LEN = 80;

/**
 * Validates a free-text place name before hitting any network API.
 */
export function validateLocationInput(raw: string): LocationValidationResult {
  const trimmed = raw.trim();

  if (trimmed.length < MIN_LEN) {
    return {
      ok: false,
      message: `Enter at least ${MIN_LEN} characters.`,
    };
  }

  if (trimmed.length > MAX_LEN) {
    return {
      ok: false,
      message: `Keep the location under ${MAX_LEN} characters.`,
    };
  }

  // No control characters; allow unicode letters, numbers, space, and common separators
  if (!/^[\p{L}\p{N}\s\-'.,()/&]+$/u.test(trimmed)) {
    return {
      ok: false,
      message: 'Use only letters, numbers, spaces, and - \' . , ( ) / &.',
    };
  }

  return { ok: true, value: trimmed };
}
