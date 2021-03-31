import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
import { AxialShapeBuilder } from './AxialShapeBuilder';
/**
 * @hidden
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
