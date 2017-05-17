"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mulSpinorE3YZ(R, S) {
    return R.yz * S.a - R.zx * S.xy + R.xy * S.zx + R.a * S.yz;
}
exports.mulSpinorE3YZ = mulSpinorE3YZ;
