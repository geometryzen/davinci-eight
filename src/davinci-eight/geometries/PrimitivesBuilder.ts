import R3 from '../math/R3';
import IPrimitivesBuilder from '../geometries/IPrimitivesBuilder';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeObject from '../checks/mustBeObject';
import Primitive from '../core/Primitive';
import Unit from '../math/Unit';
import VectorE3 from '../math/VectorE3';

export default class PrimitivesBuilder implements IPrimitivesBuilder<PrimitivesBuilder> {
    private _position = R3.zero;

    public useTextureCoords: boolean = false;

    constructor() {
        // Do nothing.
    }
    get position(): R3 {
        return this._position
    }
    set position(position: R3) {
        this.setPosition(position)
    }
    enableTextureCoords(enable: boolean): PrimitivesBuilder {
        mustBeBoolean('enable', enable)
        this.useTextureCoords = enable
        return this
    }
    setPosition(position: VectorE3): PrimitivesBuilder {
        mustBeObject('position', position)
        // The downside of using R3 is that it insists on units of measure.
        this._position = R3.fromVector(position, Unit.ONE)
        return this
    }
    toPrimitives(): Primitive[] {
        console.warn("toPrimitives() must be implemented by derived classes.")
        return []
    }
}
