import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder'

/**
 * @class SliceSimplexPrimitivesBuilder
 * @extends SimplexPrimitivesBuilder
 */
export default class SliceSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {

    /**
     * @property sliceAngle
     * @type number
     * @default 2 * Math.PI
     */
    public sliceAngle: number = 2 * Math.PI

    /**
     * @class SliceSimplexPrimitivesBuilder
     * @constructor
     */
    constructor() {
        super()
    }
}
