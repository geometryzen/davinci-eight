/**
 * Computes the inverse of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
export function inv2x2(me: Float32Array, te: Float32Array): void {

    const n11 = me[0x0], n12 = me[0x2];
    const n21 = me[0x1], n22 = me[0x3];

    // Row 1
    const o11 = n22;
    const o12 = -n12;

    // Row 2
    const o21 = -n21;
    const o22 = n11;

    const det = n11 * o11 + n21 * o12;

    const α = 1 / det;

    te[0x0] = o11 * α; te[0x4] = o12;
    te[0x1] = o21 * α; te[0x5] = o22;
}
