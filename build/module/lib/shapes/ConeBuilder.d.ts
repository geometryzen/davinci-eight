import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
import { AxialShapeBuilder } from './AxialShapeBuilder';
/**
 * @hidden
 * Generates a conical shell primitive.
 * This builder does not generate the ring that sits between the cone and the shaft.
 * Used by the ArrowBuilder to construct the arrow head.
 */
export declare class ConeBuilder extends AxialShapeBuilder {
    /**
     *
     */
    radialSegments: number;
    /**
     *
     */
    thetaSegments: number;
    height: Vector3;
    cutLine: Vector3;
    clockwise: boolean;
    constructor();
    /**
     *
     */
    toPrimitive(): Primitive;
}
