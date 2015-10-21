import VectorE3 = require('../math/VectorE3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import IGeometry = require('../geometries/IGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import mustBeObject = require('../checks/mustBeObject')
import MutableVectorE3 = require('../math/MutableVectorE3')

/**
 * @class Geometry
 */
class Geometry implements IGeometry<Geometry> {
    /**
     * @property _position
     * @type {MutableVectorE3}
     * @private
     */
    private _position = new MutableVectorE3();
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
     * @type {VectorE3}
     */
    get position(): VectorE3 {
        return this._position
    }
    set position(position: VectorE3) {
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
        this._position.copy(position)
        return this
    }
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[] {
        console.warn("Geometry.toPrimitives() must be implemented by derived classes.")
        return []
    }
}

export = Geometry