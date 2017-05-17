/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 */
export function dotVectorCartesianE2(ax: number, ay: number, bx: number, by: number): number {
    return ax * bx + ay * by;
}
