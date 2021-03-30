/**
 * Computes the y component of the cross-product of Cartesian vector components.
 * @hidden
 */
export function wedgeZX(ax, ay, az, bx, by, bz) {
    return az * bx - ax * bz;
}
