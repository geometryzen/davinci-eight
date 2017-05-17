"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 */
function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
    return ax * bx + ay * by + az * bz;
}
exports.dotVectorCartesianE3 = dotVectorCartesianE3;
