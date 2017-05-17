import { Vector3 } from '../math/Vector3';
import { Vertex } from '../atoms/Vertex';
import { Transform } from '../atoms/Transform';
/**
 *
 */
export declare class ConeTransform implements Transform {
    /**
     * The vector from the base of the cone to the apex.
     * The default is e2.
     */
    h: Vector3;
    /**
     * The radius vector and the initial direction for a slice.
     * The default is e3.
     */
    a: Vector3;
    /**
     * The perpendicular radius vector.
     * We compute this so that the grid wraps around the cone with
     * u increasing with θ and v increasing toward the apex of the cone.
     * The default is e1.
     */
    b: Vector3;
    clockwise: boolean;
    sliceAngle: number;
    aPosition: string;
    aTangent: string;
    /**
     * @param clockwise
     * @param sliceAngle
     * @param aPosition The name to use for the position attribute.
     * @param aTangent The name to use for the tangent plane attribute.
     */
    constructor(clockwise: boolean, sliceAngle: number, aPosition: string, aTangent: string);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
