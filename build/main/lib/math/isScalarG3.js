"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isScalarG3(m) {
    return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
}
exports.isScalarG3 = isScalarG3;
