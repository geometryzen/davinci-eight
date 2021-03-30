/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 * @hidden
 */
export function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
    return ax * bx + ay * by + az * bz;
}
