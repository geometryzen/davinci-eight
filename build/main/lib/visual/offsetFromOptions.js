"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometric3_1 = require("../math/Geometric3");
/**
 * Reduce to the vectorE3 data structure.
 * If the value of the vector is 0, return void 0.
 */
function simplify(vector) {
    if (vector.x !== 0 || vector.y !== 0 || vector.z !== 0) {
        return { x: vector.x, y: vector.y, z: vector.z };
    }
    else {
        return void 0;
    }
}
/**
 * This function computes the initial requested direction of an object.
 */
function offsetFromOptions(options) {
    if (options.offset) {
        return simplify(options.offset);
    }
    else {
        return simplify(Geometric3_1.Geometric3.ZERO);
    }
}
exports.offsetFromOptions = offsetFromOptions;
