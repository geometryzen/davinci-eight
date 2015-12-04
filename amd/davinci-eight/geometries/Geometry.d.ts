import CartesianE3 = require('../math/CartesianE3');
import IGeometry = require('../geometries/IGeometry');
import Primitive = require('../geometries/Primitive');
import VectorE3 = require('../math/VectorE3');
/**
 * @class Geometry
 */
declare class Geometry implements IGeometry<Geometry> {
    /**
     * @property _position
     * @type {CartesianE3}
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
     * @type {CartesianE3}
     */
    position: CartesianE3;
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {Geometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): Geometry;
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return Geometry
     * @chainable
     */
    setPosition(position: VectorE3): Geometry;
    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    toPrimitives(): Primitive[];
}
export = Geometry;
