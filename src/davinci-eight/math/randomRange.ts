/**
 * Computes a random number within the specified range.
 */
export default function(a: number, b: number): number {
  return (b - a) * Math.random() + a
}
