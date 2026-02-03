const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const URL_REGEX = /^https?:\/\/.+/;

export function validateUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function validateNotEmpty(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateURL(value: string): boolean {
  return URL_REGEX.test(value);
}

export function sanitizeText(value: string): string {
  return value.trim();
}
