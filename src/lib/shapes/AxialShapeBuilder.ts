import { ShapeBuilder } from "./ShapeBuilder";

/**
 * @hidden
 */
export class AxialShapeBuilder extends ShapeBuilder {
    /**
     * The sliceAngle is the angle from the cutLine to the end of the slice.
     * A positive slice angle represents a counter-clockwise rotation around
     * the symmetry axis direction.
     */
    public sliceAngle: number = 2 * Math.PI;

    /**
     *
     */
    constructor() {
        super();
    }
}
