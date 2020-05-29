"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomRange = void 0;
/**
 * Computes a random number within the specified range.
 */
function randomRange(a, b) {
    return (b - a) * Math.random() + a;
}
exports.randomRange = randomRange;
