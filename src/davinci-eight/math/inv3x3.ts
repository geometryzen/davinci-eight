import det3x3 = require('../math/det3x3')

/**
 * Computes the inverse of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
function inv3x3(m: Float32Array, te: Float32Array): void {

    let det = det3x3(m)

    var m11 = m[0x0], m12 = m[0x3], m13 = m[0x6];
    var m21 = m[0x1], m22 = m[0x4], m23 = m[0x7];
    var m31 = m[0x2], m32 = m[0x5], m33 = m[0x8];

    // Row 1
    let o11 = m22 * m33 - m23 * m32;
    let o12 = m13 * m32 - m12 * m33;
    let o13 = m12 * m23 - m13 * m22;

    // Row 2
    let o21 = m23 * m31 - m21 * m33;
    let o22 = m11 * m33 - m13 * m31;
    let o23 = m13 * m21 - m11 * m23;

    // Row 3
    let o31 = m21 * m32 - m22 * m31;
    let o32 = m12 * m31 - m11 * m32;
    let o33 = m11 * m22 - m12 * m21;

    let α = 1 / det;

    te[0x0] = o11 * α; te[0x3] = o12 * α; te[0x6] = o13 * α;
    te[0x1] = o21 * α; te[0x4] = o22 * α; te[0x7] = o23 * α;
    te[0x2] = o31 * α; te[0x5] = o32 * α; te[0x8] = o33 * α;
}
export = inv3x3