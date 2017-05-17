"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Computes the y component of the cross-product of Cartesian vector components.
 */
function wedgeZX(ax, ay, az, bx, by, bz) {
    return az * bx - ax * bz;
}
exports.wedgeZX = wedgeZX;
