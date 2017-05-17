"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mulSpinorE3alpha(R, S) {
    return -R.yz * S.yz - R.zx * S.zx - R.xy * S.xy + R.a * S.a;
}
exports.mulSpinorE3alpha = mulSpinorE3alpha;
