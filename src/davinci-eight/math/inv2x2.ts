/**
 * Computes the inverse of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
export default function inv2x2(me: Float32Array, te: Float32Array): void {

    var n11 = me[0x0], n12 = me[0x2];
    var n21 = me[0x1], n22 = me[0x3];

    // Row 1
    let o11 = n22;
    let o12 = -n12;

    // Row 2
    let o21 = -n21;
    let o22 = n11;

    let det = n11 * o11 + n21 * o12

    let α = 1 / det;

    te[0x0] = o11 * α; te[0x4] = o12;
    te[0x1] = o21 * α; te[0x5] = o22;
}
