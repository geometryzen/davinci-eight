/**
 * Computes the x component of the cross-product of Cartesian vector components.
 * @hidden
 */
export function wedgeYZ(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
    return ay * bz - az * by;
}
