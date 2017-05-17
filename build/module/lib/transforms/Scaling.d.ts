import { VectorE3 } from '../math/VectorE3';
import { Vertex } from '../atoms/Vertex';
import { Transform } from '../atoms/Transform';
export declare class Scaling implements Transform {
    private stress;
    private names;
    constructor(stress: VectorE3, names: string[]);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
