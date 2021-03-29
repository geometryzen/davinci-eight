/**
 * Computes a random number within the specified range.
 * @hidden
 */
export function randomRange(a: number, b: number): number {
  return (b - a) * Math.random() + a;
}
