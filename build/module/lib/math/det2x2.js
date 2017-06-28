/**
 * Computes the determinant of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
export function det2x2(m) {
    var n11 = m[0x0];
    var n12 = m[0x2];
    var n21 = m[0x1];
    var n22 = m[0x3];
    return n11 * n22 - n12 * n21;
}
