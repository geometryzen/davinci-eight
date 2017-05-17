/**
 * Computes the determinant of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
export function det2x2(m: Float32Array): number {

    const n11 = m[0x0]; const n12 = m[0x2];
    const n21 = m[0x1]; const n22 = m[0x3];

    return n11 * n22 - n12 * n21;
}
