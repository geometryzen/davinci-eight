import { ShapeBuilder } from './ShapeBuilder';
/**
 *
 */
export declare class AxialShapeBuilder extends ShapeBuilder {
    /**
     * The sliceAngle is the angle from the cutLine to the end of the slice.
     * A positive slice angle represents a counter-clockwise rotation around
     * the symmetry axis direction.
     */
    sliceAngle: number;
    /**
     *
     */
    constructor();
}
