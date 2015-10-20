import AxialGeometry = require('../geometries/AxialGeometry');
import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IGeometry = require('../geometries/IGeometry');
/**
 * @class CylinderGeometry
 */
declare class CylinderGeometry extends AxialGeometry implements IGeometry<CylinderGeometry> {
    /**
     * @property radius
     * @type {number}
     */
    radius: number;
    /**
     * @property height
     * @type {number}
     */
    height: number;
    /**
     * @property thetaSegments
     * @type {number}
     */
    thetaSegments: number;
    /**
     * @class CylinderGeometry
     * @constructor
     */
    constructor();
    setPosition(position: Cartesian3): CylinderGeometry;
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): CylinderGeometry;
}
export = CylinderGeometry;
