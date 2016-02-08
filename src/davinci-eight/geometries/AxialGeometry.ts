import CartesianE3 from '../math/CartesianE3';
import Euclidean3 from '../math/Euclidean3';
import PrimitivesBuilder from '../geometries/PrimitivesBuilder';
import IAxialGeometry from '../geometries/IAxialGeometry';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import R3 from '../math/R3';
import VectorE3 from '../math/VectorE3';

/**
 * @class AxialGeometry
 */
export default class AxialGeometry extends PrimitivesBuilder implements IAxialGeometry<AxialGeometry> {
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
        this._axis = CartesianE3.direction(axis)
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
        this._sliceStart = CartesianE3.direction(sliceStart)
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
