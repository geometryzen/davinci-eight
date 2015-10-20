import Cartesian3 = require('../math/Cartesian3')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import Vector3 = require('../math/Vector3')
import Geometry = require('../geometries/Geometry')

/**
 * @class AxialGeometry
 */
class AxialGeometry extends Geometry {
    /**
     * @property _axis
     * @type {Vector3}
     * @protected
     */
    protected _axis = Vector3.e3.clone();
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
    private _sliceStart = Vector3.e3.clone();
    /**
     * @class SliceGeometry
     * @constructor
     */
    /**
     * @class AxialGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    /**
     * @property axis
     * @type {Cartesian3}
     */
    get axis(): Cartesian3 {
        return this._axis.clone()
    }
    set axis(axis: Cartesian3) {
        mustBeObject('axis', axis)
        this._axis.copy(axis).normalize()
        this._sliceStart = Vector3.random().cross(this._axis).normalize()
    }
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
}
export = AxialGeometry