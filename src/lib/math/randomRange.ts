/**
 * Computes a random number within the specified range.
 */
export function randomRange(a: number, b: number): number {
  return (b - a) * Math.random() + a;
}
