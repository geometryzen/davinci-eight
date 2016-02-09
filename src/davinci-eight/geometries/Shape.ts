import Path from '../geometries/Path';

/**
 * @module EIGHT
 * @submodule geometries
 */

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
