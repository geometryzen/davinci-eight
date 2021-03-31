import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
import { VectorE3 } from '../math/VectorE3';
/**
 * @hidden
 */
export declare class Scaling implements Transform {
    private stress;
    private names;
    constructor(stress: VectorE3, names: string[]);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
