import CartesianE3 = require('../math/CartesianE3')
import IGeometry = require('../geometries/IGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import mustBeObject = require('../checks/mustBeObject')
import Primitive = require('../geometries/Primitive')
import VectorE3 = require('../math/VectorE3')

/**
 * @class Geometry
 */
class Geometry implements IGeometry<Geometry> {
    /**
     * @property _position
     * @type {CartesianE3}
     * @private
     */
    private _position = CartesianE3.zero;
    /**
     * @property useTextureCoords
     * @type {boolean}
     */
    public useTextureCoords: boolean = false;
    /**
     * @class Geometry
     * @constructor
     */
    constructor() {
    }
    /**
     * <p>
     * The local `position` property used for geometry generation.
     * </p>
     * @property position
     * @type {CartesianE3}
     */
    get position(): CartesianE3 {
        return this._position
    }
    set position(position: CartesianE3) {
        this.setPosition(position)
    }
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {Geometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): Geometry {
        mustBeBoolean('enable', enable)
        this.useTextureCoords = enable
        return this
    }

    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return Geometry
     * @chainable
     */
    setPosition(position: VectorE3): Geometry {
        mustBeObject('position', position)
        this._position = CartesianE3.fromVectorE3(position)
        return this
    }

    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    toPrimitives(): Primitive[] {
        console.warn("Geometry.toPrimitives() must be implemented by derived classes.")
        return []
    }
}

export = Geometry