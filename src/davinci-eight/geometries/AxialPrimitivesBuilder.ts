import PrimitivesBuilder from '../geometries/PrimitivesBuilder';

/**
 * @class AxialPrimitivesBuilder
 * @extends PrimitivesBuilder
 */
export default class AxialPrimitivesBuilder extends PrimitivesBuilder {

    /**
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
