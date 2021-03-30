/**
 * Computes the x component of the cross-product of Cartesian vector components.
 * @hidden
 */
export function wedgeYZ(ax, ay, az, bx, by, bz) {
    return ay * bz - az * by;
}
