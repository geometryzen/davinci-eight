import CartesianE3 from '../math/CartesianE3';
import IPrimitivesBuilder from '../geometries/IPrimitivesBuilder';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeObject from '../checks/mustBeObject';
import Primitive from '../core/Primitive';
import VectorE3 from '../math/VectorE3';

/**
 * @class PrimitivesBuilder
 */
export default class PrimitivesBuilder implements IPrimitivesBuilder<PrimitivesBuilder> {

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
     * @class PrimitivesBuilder
     * @constructor
     */
    constructor() {
      // Do nothing.
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
     * @return {PrimitivesBuilder}
     * @chainable
     */
    enableTextureCoords(enable: boolean): PrimitivesBuilder {
        mustBeBoolean('enable', enable)
        this.useTextureCoords = enable
        return this
    }

    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return PrimitivesBuilder
     * @chainable
     */
    setPosition(position: VectorE3): PrimitivesBuilder {
        mustBeObject('position', position)
        this._position = CartesianE3.fromVectorE3(position)
        return this
    }

    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    toPrimitives(): Primitive[] {
        console.warn("toPrimitives() must be implemented by derived classes.")
        return []
    }
}
