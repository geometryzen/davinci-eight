import VectorE3 = require('../math/VectorE3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IGeometry = require('../geometries/IGeometry');
/**
 * @class Geometry
 */
declare class Geometry implements IGeometry<Geometry> {
    /**
     * @property _position
     * @type {MutableVectorE3}
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
     * @type {VectorE3}
     */
    position: VectorE3;
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
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
}
export = Geometry;
