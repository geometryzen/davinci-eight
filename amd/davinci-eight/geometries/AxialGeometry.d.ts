import CartesianE3 = require('../math/CartesianE3');
import Geometry = require('../geometries/Geometry');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import VectorE3 = require('../math/VectorE3');
/**
 * @class AxialGeometry
 */
declare class AxialGeometry extends Geometry implements IAxialGeometry<AxialGeometry> {
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
    private _sliceAngle;
    /**
     * @property _sliceStart
     * @type {CartesianE3}
     * @private
     */
    private _sliceStart;
    /**
     * @class AxialGeometry
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
     * @param sliceStart [VectorE3] A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart?: VectorE3);
    /**
     * @property axis
     * @type {CartesianE3}
     */
    axis: CartesianE3;
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
     * @type {CartesianE3}
     */
    sliceStart: CartesianE3;
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {AxialGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): AxialGeometry;
    setSliceStart(sliceStart: VectorE3): void;
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialGeometry}
     */
    enableTextureCoords(enable: boolean): AxialGeometry;
}
export = AxialGeometry;
