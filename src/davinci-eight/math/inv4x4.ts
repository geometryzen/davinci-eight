/**
 * Computes the inverse of a 4x4 (square) matrix where the elements are assumed to be in column-major order.
 */
export default function inv4x4(me: Float32Array, te: Float32Array): void {

    var n11 = me[0x0], n12 = me[0x4], n13 = me[0x8], n14 = me[0xC];
    var n21 = me[0x1], n22 = me[0x5], n23 = me[0x9], n24 = me[0xD];
    var n31 = me[0x2], n32 = me[0x6], n33 = me[0xA], n34 = me[0xE];
    var n41 = me[0x3], n42 = me[0x7], n43 = me[0xB], n44 = me[0xF];

    // Row 1
    let o11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    let o12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    let o13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    let o14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    // Row 2
    let o21 = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    let o22 = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    let o23 = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    let o24 = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;

    // Row 3
    let o31 = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    let o32 = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    let o33 = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    let o34 = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;

    // Row 4
    let o41 = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    let o42 = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    let o43 = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    let o44 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

    let det = n11 * o11 + n21 * o12 + n31 * o13 + n41 * o14

    let α = 1 / det;

    te[0x0] = o11 * α; te[0x4] = o12 * α; te[0x8] = o13 * α; te[0xC] = o14 * α;
    te[0x1] = o21 * α; te[0x5] = o22 * α; te[0x9] = o23 * α; te[0xD] = o24 * α;
    te[0x2] = o31 * α; te[0x6] = o32 * α; te[0xA] = o33 * α; te[0xE] = o34 * α;
    te[0x3] = o41 * α; te[0x7] = o42 * α; te[0xB] = o43 * α; te[0xF] = o44 * α;
}
