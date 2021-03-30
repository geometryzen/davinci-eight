/**
 * Computes the determinant of a 3x3 (square) matrix where the elements are assumed to be in column-major order.
 * @hidden
 */
export function det3x3(m: Float32Array): number {

    const m00 = m[0x0], m01 = m[0x3], m02 = m[0x6];
    const m10 = m[0x1], m11 = m[0x4], m12 = m[0x7];
    const m20 = m[0x2], m21 = m[0x5], m22 = m[0x8];

    return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
}
