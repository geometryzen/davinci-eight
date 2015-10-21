/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 */
function cartesianQuaditudeE3(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
  return ax * bx + ay * by + az * bz;
}

export = cartesianQuaditudeE3
