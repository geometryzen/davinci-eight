"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wedgeXY = void 0;
/**
 * Computes the z component of the cross-product of Cartesian vector components.
 */
function wedgeXY(ax, ay, az, bx, by, bz) {
    return ax * by - ay * bx;
}
exports.wedgeXY = wedgeXY;
