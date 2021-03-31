import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
/**
 * Applies coordinates to a line.
 * @hidden
 */
export declare class CoordsTransform1D implements Transform {
    flipU: boolean;
    constructor(flipU: boolean);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
