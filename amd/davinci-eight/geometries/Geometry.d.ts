import CartesianE3 = require('../math/CartesianE3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IGeometry = require('../geometries/IGeometry');
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
     * @param position {{x: number, y: number, z: number}}
     * @return Geometry
     * @chainable
     */
    setPosition(position: {
        x: number;
        y: number;
        z: number;
    }): Geometry;
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
}
export = Geometry;
