export function exists<T>(val: unknown): val is NonNullable<T> {
  return val !== null && val !== undefined;
}
