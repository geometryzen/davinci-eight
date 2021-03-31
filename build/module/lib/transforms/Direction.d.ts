import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
/**
 * @hidden
 */
export declare class Direction implements Transform {
    /**
     *
     */
    private sourceName;
    constructor(sourceName: string);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
