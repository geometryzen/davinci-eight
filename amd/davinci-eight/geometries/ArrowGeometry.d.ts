import VectorE3 = require('../math/VectorE3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import AxialGeometry = require('../geometries/AxialGeometry');
import IAxialGeometry = require('../geometries/IAxialGeometry');
/**
 * @class ArrowGeometry
 */
declare class ArrowGeometry extends AxialGeometry implements IAxialGeometry<ArrowGeometry> {
    /**
     * @property heightCone
     * @type {number}
     */
    heightCone: number;
    /**
     * @property radiusCone
     * @type {number}
     */
    radiusCone: number;
    /**
     * @property radiusShaft
     * @type {number}
     */
    radiusShaft: number;
    /**
     * @property thetaSegments
     * @type {number}
     */
    thetaSegments: number;
    /**
     * @class ArrowGeometry
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
     * @param sliceStart [VectorE3] A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart?: VectorE3);
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {ArrowGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): ArrowGeometry;
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {ArrowGeometry}
     * @chaninable
     */
    setAxis(axis: VectorE3): ArrowGeometry;
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): ArrowGeometry;
}
export = ArrowGeometry;
