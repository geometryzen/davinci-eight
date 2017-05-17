import { VectorE3 } from '../math/VectorE3';
import { Vertex } from '../atoms/Vertex';
import { Transform } from '../atoms/Transform';
/**
 *
 */
export declare class CylinderTransform implements Transform {
    /**
     * Vector pointing along the symmetry axis of the cone and also representing the height of the cylinder.
     */
    private height;
    /**
     * Starting direction and the radius vector that is swept out.
     */
    private cutLine;
    private generator;
    private sliceAngle;
    private aPosition;
    private aTangent;
    /**
     * +1 is conventional orientation with outward normals.
     * -1 for inward facing normals.
     */
    private orientation;
    /**
     * @param sliceAngle
     * @param aPosition The name to use for the position attribute.
     * @param aTangent The name to use for the tangent plane attribute.
     */
    constructor(height: VectorE3, cutLine: VectorE3, clockwise: boolean, sliceAngle: number, orientation: number, aPosition: string, aTangent: string);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
