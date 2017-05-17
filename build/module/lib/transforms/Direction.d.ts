import { Vertex } from '../atoms/Vertex';
import { Transform } from '../atoms/Transform';
export declare class Direction implements Transform {
    /**
     *
     */
    private sourceName;
    constructor(sourceName: string);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
