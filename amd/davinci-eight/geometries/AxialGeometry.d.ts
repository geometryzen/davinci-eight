import Geometry = require('../geometries/Geometry');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import MutableVectorE3 = require('../math/MutableVectorE3');
import VectorE3 = require('../math/VectorE3');
/**
 * @class AxialGeometry
 */
declare class AxialGeometry extends Geometry implements IAxialGeometry<AxialGeometry> {
    /**
     * @property _axis
     * @type {MutableVectorE3}
     * @protected
     */
    protected _axis: MutableVectorE3;
    /**
     * @property _sliceAngle
     * @type {number}
     * @private
     */
    private _sliceAngle;
    /**
     * @property _sliceStart
     * @type {MutableVectorE3}
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
     * @type {VectorE3}
     */
    axis: VectorE3;
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {AxialGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): AxialGeometry;
    /**
     * @property sliceAngle
     * @type {number}
     * @default 2 * Math.PI
     */
    sliceAngle: number;
    /**
     * The (unit vector) direction of the start of the slice.
     * @property sliceStart
     * @type {VectorE3}
     */
    sliceStart: VectorE3;
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {AxialGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): AxialGeometry;
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialGeometry}
     */
    enableTextureCoords(enable: boolean): AxialGeometry;
}
export = AxialGeometry;
