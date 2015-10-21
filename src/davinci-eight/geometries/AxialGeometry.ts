import Cartesian3 = require('../math/Cartesian3')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import Vector3 = require('../math/Vector3')
import Geometry = require('../geometries/Geometry')

/**
 * @class AxialGeometry
 */
class AxialGeometry extends Geometry implements IAxialGeometry<AxialGeometry> {
    /**
     * @property _axis
     * @type {Vector3}
     * @protected
     */
    protected _axis: Vector3;
    /**
     * @property _sliceAngle
     * @type {number}
     * @private
     */
    private _sliceAngle: number = 2 * Math.PI;
    /**
     * @property _sliceStart
     * @type {Vector3}
     * @private
     */
    private _sliceStart: Vector3;
    /**
     * @class SliceGeometry
     * @constructor
     */
    constructor() {
        super()
        this._axis = Vector3.e2.clone()
        this._sliceStart = Vector3.e1.clone()
    }
    /**
     * @property axis
     * @type {Cartesian3}
     */
    get axis(): Cartesian3 {
        return this._axis.clone()
    }
    set axis(axis: Cartesian3) {
        this.setAxis(axis)
    }
    /**
     * @method setAxis
     * @param axis {Cartesian3}
     * @return {AxialGeometry}
     * @chainable
     */
    setAxis(axis: Cartesian3): AxialGeometry {
        mustBeObject('axis', axis)
        this._axis.copy(axis).normalize()
        // FIXME: randomize
        this._sliceStart.copy(Vector3.random()).cross(this._axis).normalize()
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
     * @type {Cartesian3}
     */
    get sliceStart(): Cartesian3 {
        return this._sliceStart.clone()
    }
    set sliceStart(sliceStart: Cartesian3) {
        mustBeObject('sliceStart', sliceStart)
        this._sliceStart.copy(sliceStart).normalize()
    }
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {AxialGeometry}
     * @chainable
     */
    setPosition(position: Cartesian3): AxialGeometry {
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