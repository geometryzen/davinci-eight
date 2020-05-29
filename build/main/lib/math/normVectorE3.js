"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normVectorE3 = void 0;
function normVectorE3(vector) {
    var x = vector.x;
    var y = vector.y;
    var z = vector.z;
    return Math.sqrt(x * x + y * y + z * z);
}
exports.normVectorE3 = normVectorE3;
