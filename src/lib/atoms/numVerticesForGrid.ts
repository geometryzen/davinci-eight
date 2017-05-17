import { mustBeInteger } from '../checks/mustBeInteger';

/**
 * Computes the number of vertices required to construct a grid.
 */
export function numVerticesForGrid(uSegments: number, vSegments: number): number {
    mustBeInteger('uSegments', uSegments);
    mustBeInteger('vSegments', vSegments);
    return (uSegments + 1) * (vSegments + 1);
}
