import Curve from '../curves/Curve';
import Path from '../geometries/Path';

/**
 * @class Shape
 */
export default class Shape extends Path {
    holes: Path[]
    /**
     * @class Shape
     * @constructor
     */
    constructor() {
        super()
        this.holes = []
    }
}
