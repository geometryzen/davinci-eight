import { AxialShapeBuilder } from './AxialShapeBuilder';
import { Primitive } from '../core/Primitive';
import { VectorE3 } from '../math/VectorE3';
/**
 * <p>
 * This class does not default the initial <b>axis</b>.
 * </p>
 * <p>
 * This class does not default the <b>cutLine</b>.
 * </p>
 */
export declare class ArrowBuilder extends AxialShapeBuilder {
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
