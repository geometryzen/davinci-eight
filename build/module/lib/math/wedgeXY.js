/**
 * Computes the z component of the cross-product of Cartesian vector components.
 * @hidden
 */
export function wedgeXY(ax, ay, az, bx, by, bz) {
    return ax * by - ay * bx;
}
