/**
 * Computes a random number within the specified range.
 * @hidden
 */
export function randomRange(a, b) {
    return (b - a) * Math.random() + a;
}
