"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorE3Object = void 0;
/**
 * Reduce to the VectorE3 to a simple object data structure.
 */
function vectorE3Object(vector) {
    if (vector) {
        return { x: vector.x, y: vector.y, z: vector.z };
    }
    else {
        return void 0;
    }
}
exports.vectorE3Object = vectorE3Object;
