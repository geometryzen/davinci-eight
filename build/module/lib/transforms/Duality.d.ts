import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
/**
 * Applies a duality transformation to the specified attributes of a vertex, creating a new attribute.
 * The convention used is pre-multiplication by the pseudoscalar.
 * @hidden
 */
export declare class Duality implements Transform {
    /**
     *
     */
    private sourceName;
    /**
     *
     */
    private outputName;
    /**
     * Determines whether to remove the source attribute.
     */
    private removeSource;
    constructor(sourceName: string, outputName: string, removeSource: boolean);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
