import Euclidean3 = require('../math/Euclidean3')
import Geometry = require('../geometries/Geometry')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import R3 = require('../math/R3')
import VectorE3 = require('../math/VectorE3')

/**
 * @class AxialGeometry
 */
class AxialGeometry extends Geometry implements IAxialGeometry<AxialGeometry> {
    /**
     * @property _axis
     * @type {R3}
     * @protected
     */
    protected _axis: R3;
    /**
     * @property _sliceAngle
     * @type {number}
     * @private
     */
    private _sliceAngle: number = 2 * Math.PI;
    /**
     * @property _sliceStart
     * @type {R3}
     * @private
     */
    private _sliceStart: R3;
    /**
     * @class SliceGeometry
     * @constructor
     */
    constructor() {
        super()
        this._axis = R3.copy(Euclidean3.e2)
        this._sliceStart = R3.copy(Euclidean3.e1)
    }
    /**
     * @property axis
     * @type {VectorE3}
     */
    get axis(): VectorE3 {
        return this._axis.clone()
    }
    set axis(axis: VectorE3) {
        this.setAxis(axis)
    }
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {AxialGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): AxialGeometry {
        mustBeObject('axis', axis)
        this._axis.copy(axis).normalize()
        // FIXME: randomize
        this._sliceStart.copy(R3.random()).cross(this._axis).normalize()
        return this;
    }
    /**
     * @property sliceAngle
     * @type {number}
     * @default 2 * Math.PI
     */
    get sliceAngle(): number {
        return this._sliceAngle;
    }
    set sliceAngle(sliceAngle: number) {
        mustBeNumber('sliceAngle', sliceAngle)
        this._sliceAngle = sliceAngle;
    }
    /**
     * The (unit vector) direction of the start of the slice.
     * @property sliceStart
     * @type {VectorE3}
     */
    get sliceStart(): VectorE3 {
        return this._sliceStart.clone()
    }
    set sliceStart(sliceStart: VectorE3) {
        mustBeObject('sliceStart', sliceStart)
        this._sliceStart.copy(sliceStart).normalize()
    }
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {AxialGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): AxialGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialGeometry}
     */
    enableTextureCoords(enable: boolean): AxialGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
export = AxialGeometry