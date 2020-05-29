"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wedgeYZ = void 0;
/**
 * Computes the x component of the cross-product of Cartesian vector components.
 */
function wedgeYZ(ax, ay, az, bx, by, bz) {
    return ay * bz - az * by;
}
exports.wedgeYZ = wedgeYZ;
