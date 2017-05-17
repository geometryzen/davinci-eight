import { AxialShapeBuilder } from './AxialShapeBuilder';
import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
/**
 *
 */
export declare class ConicalShellBuilder extends AxialShapeBuilder {
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
