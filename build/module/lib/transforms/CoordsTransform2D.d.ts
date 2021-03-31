import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
/**
 * Applies coordinates to a surface.
 * @hidden
 */
export declare class CoordsTransform2D implements Transform {
    flipU: boolean;
    flipV: boolean;
    exchageUV: boolean;
    constructor(flipU: boolean, flipV: boolean, exchangeUV: boolean);
    /**
     * @method exec
     * @param vertex {Vertex}
     * @param i {number}
     * @param j {number}
     * @param iLength {number}
     * @param jLength {number}
     */
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
