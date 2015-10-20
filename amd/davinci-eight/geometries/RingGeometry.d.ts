import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IGeometry = require('../geometries/IGeometry');
import AxialGeometry = require('../geometries/AxialGeometry');
/**
 * @class RingGeometry
 */
declare class RingGeometry extends AxialGeometry implements IGeometry<RingGeometry> {
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
    setPosition(position: Cartesian3): RingGeometry;
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): RingGeometry;
}
export = RingGeometry;
