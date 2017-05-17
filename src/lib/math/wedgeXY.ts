/**
 * Computes the z component of the cross-product of Cartesian vector components.
 */
export function wedgeXY(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
    return ax * by - ay * bx;
}
