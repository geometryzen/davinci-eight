import { Vertex } from '../atoms/Vertex';
import { Transform } from '../atoms/Transform';
/**
 * Applies coordinates to a line.
 */
export declare class CoordsTransform1D implements Transform {
    flipU: boolean;
    constructor(flipU: boolean);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
