"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Computes a random number within the specified range.
 */
function randomRange(a, b) {
    return (b - a) * Math.random() + a;
}
exports.randomRange = randomRange;
