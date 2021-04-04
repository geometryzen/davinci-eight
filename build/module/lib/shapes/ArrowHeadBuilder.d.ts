import { Primitive } from '../core/Primitive';
import { VectorE3 } from '../math/VectorE3';
import { AxialShapeBuilder } from './AxialShapeBuilder';
/**
 * @hidden
 */
export declare class ArrowHeadBuilder extends AxialShapeBuilder {
    heightCone: number;
    radiusCone: number;
    radiusShaft: number;
    thetaSegments: number;
    private e;
    private cutLine;
    private clockwise;
    /**
     *
     * @param axis The direction of the arrow. The argument is normalized to a unit vector.
     * @param cutLine The direction of the start of the arrow slice. The argument is normalized to a unit vector.
     * @param clockwise The orientation
     */
    constructor(axis: VectorE3, cutLine: VectorE3, clockwise: boolean);
    /**
     *
     */
    toPrimitive(): Primitive;
}
