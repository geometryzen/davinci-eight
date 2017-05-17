"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isVectorG3(m) {
    return m.a === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
}
exports.isVectorG3 = isVectorG3;
