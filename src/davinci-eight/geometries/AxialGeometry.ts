import CartesianE3 = require('../math/CartesianE3')
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
     * @type {CartesianE3}
     * @protected
     */
    protected _axis: CartesianE3;
    /**
     * @property _sliceAngle
     * @type {number}
     * @private
     */
    private _sliceAngle: number = 2 * Math.PI;
    /**
     * @property _sliceStart
     * @type {CartesianE3}
     * @private
     */
    private _sliceStart: CartesianE3;
    /**
     * @class AxialGeometry
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity. 
     * @param sliceStart [VectorE3] A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart?: VectorE3) {
        super()
        this.setAxis(axis)
        if (sliceStart) {
            this.setSliceStart(sliceStart)
        }
        else {
            this.setSliceStart(R3.random().cross(axis))
        }
    }
    /**
     * @property axis
     * @type {CartesianE3}
     */
    get axis(): CartesianE3 {
        return this._axis
    }
    set axis(axis: CartesianE3) {
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
        this._axis = CartesianE3.normalize(axis)
        this.setSliceStart(R3.random().cross(this._axis))
        return this
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
     * @type {CartesianE3}
     */
    get sliceStart(): CartesianE3 {
        return this._sliceStart
    }
    set sliceStart(sliceStart: CartesianE3) {
        // Make sure that we normalize the vector.
        this.setSliceStart(sliceStart)
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
    setSliceStart(sliceStart: VectorE3) {
        mustBeObject('sliceStart', sliceStart)
        this._sliceStart = CartesianE3.normalize(sliceStart)
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