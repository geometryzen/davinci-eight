"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Computes the determinant of a 4x4 (square) matrix where the elements are assumed to be in column-major order.
 */
function det4x4(m) {
    var n11 = m[0x0], n12 = m[0x4], n13 = m[0x8], n14 = m[0xC];
    var n21 = m[0x1], n22 = m[0x5], n23 = m[0x9], n24 = m[0xD];
    var n31 = m[0x2], n32 = m[0x6], n33 = m[0xA], n34 = m[0xE];
    var n41 = m[0x3], n42 = m[0x7], n43 = m[0xB], n44 = m[0xF];
    var n1122 = n11 * n22;
    var n1123 = n11 * n23;
    var n1124 = n11 * n24;
    var n1221 = n12 * n21;
    var n1223 = n12 * n23;
    var n1224 = n12 * n24;
    var n1321 = n13 * n21;
    var n1322 = n13 * n22;
    var n1324 = n13 * n24;
    var n1421 = n14 * n21;
    var n1422 = n14 * n22;
    var n1423 = n14 * n23;
    return n41 * ((n1423 - n1324) * n32 + (n1224 - n1422) * n33 + (n1322 - n1223) * n34) +
        n42 * ((n1324 - n1423) * n31 + (n1421 - n1124) * n33 + (n1123 - n1321) * n34) +
        n43 * ((n1422 - n1224) * n31 + (n1124 - n1421) * n32 + (n1221 - n1122) * n34) +
        n44 * ((n1223 - n1322) * n31 + (n1321 - n1123) * n32 + (n1122 - n1221) * n33);
}
exports.det4x4 = det4x4;
