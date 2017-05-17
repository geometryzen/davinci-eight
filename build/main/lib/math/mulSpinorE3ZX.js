"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mulSpinorE3ZX(R, S) {
    return R.yz * S.xy + R.zx * S.a - R.xy * S.yz + R.a * S.zx;
}
exports.mulSpinorE3ZX = mulSpinorE3ZX;
