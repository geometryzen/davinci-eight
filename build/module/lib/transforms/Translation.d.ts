import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
import { VectorE3 } from '../math/VectorE3';
/**
 * Applies a translation to the specified attributes of a vertex.
 * @hidden
 */
export declare class Translation implements Transform {
    /**
     * The translation to be applied.
     */
    private s;
    /**
     * The names of the attributes that will be affected.
     */
    private names;
    constructor(s: VectorE3, names: string[]);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
