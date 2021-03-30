import { mustBeInteger } from '../checks/mustBeInteger';
/**
 * Computes the number of vertices required to construct a curve.
 * @hidden
 */
export function numVerticesForCurve(uSegments) {
    mustBeInteger('uSegments', uSegments);
    return uSegments + 1;
}
