import { mustBeInteger } from '../checks/mustBeInteger';
/**
 * Computes the number of vertices required to construct a curve.
 */
export function numVerticesForCurve(uSegments) {
    mustBeInteger('uSegments', uSegments);
    return uSegments + 1;
}
