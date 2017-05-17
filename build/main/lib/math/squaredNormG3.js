"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function squaredNormG3(m) {
    var a = m.a;
    var x = m.x;
    var y = m.y;
    var z = m.z;
    var yz = m.yz;
    var zx = m.zx;
    var xy = m.xy;
    var b = m.b;
    return a * a + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + b * b;
}
exports.squaredNormG3 = squaredNormG3;
