/**
 * Computes the y component of the cross-product of Cartesian vector components.
 * @hidden
 */
export function wedgeZX(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
    return az * bx - ax * bz;
}
