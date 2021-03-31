import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
import { VectorE3 } from '../math/VectorE3';
/**
 * @hidden
 */
export declare class RingTransform implements Transform {
    private e;
    private cutLine;
    private innerRadius;
    private outerRadius;
    private sliceAngle;
    private generator;
    private aPosition;
    private aTangent;
    /**
     * @param e The axis normal to the plane of the ring.
     * @param cutLine
     * @param clockwise
     * @param a The outer radius.
     * @param b The inner radius.
     * @param aPosition The name to use for the position attribute.
     */
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean, a: number, b: number, sliceAngle: number, aPosition: string, aTangent: string);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
