import { Vertex } from '../atoms/Vertex';
import { Transform } from '../atoms/Transform';
/**
 * Applies a duality transformation to the specified attributes of a vertex, creating a new attribute.
 * The convention used is pre-multiplication by the pseudoscalar.
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
     * Determines whether to change the sign from the dual(m) = I * m convention.
     */
    private changeSign;
    /**
     * Determines whether to remove the source attribute.
     */
    private removeSource;
    constructor(sourceName: string, outputName: string, changeSign: boolean, removeSource: boolean);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
