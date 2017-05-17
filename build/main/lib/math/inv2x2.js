"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Computes the inverse of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
function inv2x2(me, te) {
    var n11 = me[0x0], n12 = me[0x2];
    var n21 = me[0x1], n22 = me[0x3];
    // Row 1
    var o11 = n22;
    var o12 = -n12;
    // Row 2
    var o21 = -n21;
    var o22 = n11;
    var det = n11 * o11 + n21 * o12;
    var α = 1 / det;
    te[0x0] = o11 * α;
    te[0x4] = o12;
    te[0x1] = o21 * α;
    te[0x5] = o22;
}
exports.inv2x2 = inv2x2;
