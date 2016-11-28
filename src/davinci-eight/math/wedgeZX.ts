/**
 * Computes the y component of the cross-product of Cartesian vector components.
 */
function wedgeZX(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
    return az * bx - ax * bz;
}

export default wedgeZX;

