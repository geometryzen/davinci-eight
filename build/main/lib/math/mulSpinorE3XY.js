"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mulSpinorE3XY = void 0;
function mulSpinorE3XY(R, S) {
    return -R.yz * S.zx + R.zx * S.yz + R.xy * S.a + R.a * S.xy;
}
exports.mulSpinorE3XY = mulSpinorE3XY;
