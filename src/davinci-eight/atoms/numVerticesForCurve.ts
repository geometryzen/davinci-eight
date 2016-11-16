import mustBeInteger from '../checks/mustBeInteger';

/**
 * Computes the number of vertices required to construct a curve.
 */
export default function (uSegments: number): number {
    mustBeInteger('uSegments', uSegments);
    return uSegments + 1;
}
