import PrimitivesBuilder from '../geometries/PrimitivesBuilder';

/**
 * @class AxialPrimitivesBuilder
 * @extends PrimitivesBuilder
 */
export default class AxialPrimitivesBuilder extends PrimitivesBuilder {

    /**
     * The sliceAngle is the angle from the cutLine to the end of the slice.
     * A positive slice angle represents a counter-clockwise rotation around
     * the symmetry axis direction.
     *
     * @property sliceAngle
     * @type number
     * @default 2 * Math.PI
     */
    public sliceAngle: number = 2 * Math.PI

    /**
     * @class AxialPrimitivesBuilder
     * @constructor
     */
    constructor() {
        super()
    }
}
