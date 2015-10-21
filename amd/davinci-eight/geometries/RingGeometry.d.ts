import Cartesian3 = require('../math/Cartesian3');
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
     */
    constructor();
    /**
     * @method setAxis
     * @param axis
     * @return {RingGeometry}
     * @chainable
     */
    setAxis(axis: Cartesian3): RingGeometry;
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {RingGeometry}
     * @chainable
     */
    setPosition(position: Cartesian3): RingGeometry;
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
