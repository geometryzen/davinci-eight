/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 * @hidden
 */
export function dotVectorCartesianE3(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
    return ax * bx + ay * by + az * bz;
}
