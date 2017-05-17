import { Vertex } from '../atoms/Vertex';
import { Transform } from '../atoms/Transform';
/**
 * A `Transform` that calls the `approx` method on a `Vertex` attribute.
 */
export declare class Approximation implements Transform {
    /**
     *
     */
    private n;
    /**
     * The names of the attributes that will be affected.
     */
    private names;
    /**
     * @param n The value that will be passed to the `approx` method.
     * @param names The names of the attributes that are affected.
     */
    constructor(n: number, names: string[]);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
