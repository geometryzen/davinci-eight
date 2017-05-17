"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Computes the inverse of a 4x4 (square) matrix where the elements are assumed to be in column-major order.
 */
function inv4x4(src, dest) {
    var n11 = src[0x0], n12 = src[0x4], n13 = src[0x8], n14 = src[0xC];
    var n21 = src[0x1], n22 = src[0x5], n23 = src[0x9], n24 = src[0xD];
    var n31 = src[0x2], n32 = src[0x6], n33 = src[0xA], n34 = src[0xE];
    var n41 = src[0x3], n42 = src[0x7], n43 = src[0xB], n44 = src[0xF];
    // Row 1
    var o11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    var o12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    var o13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    var o14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    // Row 2
    var o21 = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    var o22 = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    var o23 = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    var o24 = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    // Row 3
    var o31 = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    var o32 = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    var o33 = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    var o34 = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    // Row 4
    var o41 = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    var o42 = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    var o43 = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    var o44 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
    var det = n11 * o11 + n21 * o12 + n31 * o13 + n41 * o14;
    var α = 1 / det;
    dest[0x0] = o11 * α;
    dest[0x4] = o12 * α;
    dest[0x8] = o13 * α;
    dest[0xC] = o14 * α;
    dest[0x1] = o21 * α;
    dest[0x5] = o22 * α;
    dest[0x9] = o23 * α;
    dest[0xD] = o24 * α;
    dest[0x2] = o31 * α;
    dest[0x6] = o32 * α;
    dest[0xA] = o33 * α;
    dest[0xE] = o34 * α;
    dest[0x3] = o41 * α;
    dest[0x7] = o42 * α;
    dest[0xB] = o43 * α;
    dest[0xF] = o44 * α;
}
exports.inv4x4 = inv4x4;
