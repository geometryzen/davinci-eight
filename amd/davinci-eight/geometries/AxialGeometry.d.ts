import Cartesian3 = require('../math/Cartesian3');
import Vector3 = require('../math/Vector3');
import Geometry = require('../geometries/Geometry');
/**
 * @class AxialGeometry
 */
declare class AxialGeometry extends Geometry {
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
    private _sliceAngle;
    /**
     * @property _sliceStart
     * @type {Vector3}
     * @private
     */
    private _sliceStart;
    /**
     * @class SliceGeometry
     * @constructor
     */
    /**
     * @class AxialGeometry
     * @constructor
     */
    constructor();
    /**
     * @property axis
     * @type {Cartesian3}
     */
    axis: Cartesian3;
    sliceAngle: number;
    /**
     * The (unit vector) direction of the start of the slice.
     * @property sliceStart
     * @type {Cartesian3}
     */
    sliceStart: Cartesian3;
}
export = AxialGeometry;
