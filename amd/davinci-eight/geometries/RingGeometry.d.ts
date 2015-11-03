import VectorE3 = require('../math/VectorE3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import AxialGeometry = require('../geometries/AxialGeometry');
/**
 * @class RingGeometry
 */
declare class RingGeometry extends AxialGeometry implements IAxialGeometry<RingGeometry> {
    /**
     * @property innerRadius
     * @type {number}
     */
    innerRadius: number;
    /**
     * @property outerRadius
     * @type {number}
     */
    outerRadius: number;
    /**
     * @property thetaSegments
     * @type {number}
     */
    thetaSegments: number;
    /**
     * @class RingGeometry
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
     * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart: VectorE3);
    /**
     * @method setAxis
     * @param axis
     * @return {RingGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): RingGeometry;
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {RingGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): RingGeometry;
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {RingGeometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): RingGeometry;
}
export = RingGeometry;
