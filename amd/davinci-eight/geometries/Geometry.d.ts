import Cartesian3 = require('../math/Cartesian3');
/**
 * @class Geometry
 */
declare class Geometry {
    /**
     * @property _position
     * @type {Vector3}
     * @private
     */
    private _position;
    /**
     * @property useTextureCoords
     * @type {boolean}
     */
    useTextureCoords: boolean;
    /**
     * @class Geometry
     * @constructor
     */
    constructor();
    /**
     * <p>
     * The local `position` property used for geometry generation.
     * </p>
     * @property position
     * @type {Cartesian3}
     */
    position: Cartesian3;
}
export = Geometry;
