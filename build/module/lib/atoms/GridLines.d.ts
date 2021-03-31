import { GridPrimitive } from './GridPrimitive';
import { Vertex } from './Vertex';
/**
 * @hidden
 */
export declare class GridLines extends GridPrimitive {
    /**
     * @param uSegments
     * @param uClosed
     * @param vSegments
     * @param vClosed
     */
    constructor(uSegments: number, uClosed: boolean, vSegments: number, vClosed: boolean);
    /**
     * @method vertex
     * @param i An integer. 0 <= i < uLength
     * @param j An integer. 0 <= j < vLength
     */
    vertex(i: number, j: number): Vertex;
}
