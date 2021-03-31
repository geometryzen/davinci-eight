import { GridPrimitive } from './GridPrimitive';
import { Vertex } from './Vertex';
/**
 * Used for creating TRIANGLE_STRIP primitives.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 * @hidden
 */
export declare class GridTriangleStrip extends GridPrimitive {
    /**
     * @param uSegments
     * @param vSegments
     */
    constructor(uSegments: number, vSegments: number);
    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     * @param vIndex An integer. 0 <= vIndex < vLength
     */
    vertex(uIndex: number, vIndex: number): Vertex;
}
