"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function scpE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    switch (index) {
        case 0:
            return a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        case 1:
            return 0;
        case 2:
            return 0;
        case 3:
            return 0;
        default:
            throw new Error("index must be in the range [0..3]");
    }
}
exports.scpE2 = scpE2;
