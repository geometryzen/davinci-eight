import { PrimitivesBuilder } from '../geometries/PrimitivesBuilder';
export declare class AxialPrimitivesBuilder extends PrimitivesBuilder {
    /**
     * The sliceAngle is the angle from the cutLine to the end of the slice.
     * A positive slice angle represents a counter-clockwise rotation around
     * the symmetry axis direction.
     */
    sliceAngle: number;
    constructor();
}
