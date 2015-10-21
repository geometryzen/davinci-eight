import Cartesian3 = require('../math/Cartesian3');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import Vector3 = require('../math/Vector3');
import Geometry = require('../geometries/Geometry');
/**
 * @class AxialGeometry
 */
declare class AxialGeometry extends Geometry implements IAxialGeometry<AxialGeometry> {
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
    constructor();
    /**
     * @property axis
     * @type {Cartesian3}
     */
    axis: Cartesian3;
    /**
     * @method setAxis
     * @param axis {Cartesian3}
     * @return {AxialGeometry}
     * @chainable
     */
    setAxis(axis: Cartesian3): AxialGeometry;
    /**
     * @property sliceAngle
     * @type {number}
     * @default 2 * Math.PI
     */
    sliceAngle: number;
    /**
     * The (unit vector) direction of the start of the slice.
     * @property sliceStart
     * @type {Cartesian3}
     */
    sliceStart: Cartesian3;
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {AxialGeometry}
     * @chainable
     */
    setPosition(position: Cartesian3): AxialGeometry;
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialGeometry}
     */
    enableTextureCoords(enable: boolean): AxialGeometry;
}
export = AxialGeometry;
