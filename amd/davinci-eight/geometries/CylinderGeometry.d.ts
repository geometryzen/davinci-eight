import AxialGeometry = require('../geometries/AxialGeometry');
import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IAxialGeometry = require('../geometries/IAxialGeometry');
/**
 * @class CylinderGeometry
 */
declare class CylinderGeometry extends AxialGeometry implements IAxialGeometry<CylinderGeometry> {
    /**
     * @property radius
     * @type {number}
     * @default 1
     */
    radius: number;
    /**
     * @property height
     * @type {number}
     * @default 1
     */
    height: number;
    /**
     * @property thetaSegments
     * @type {number}
     * @default 16
     */
    thetaSegments: number;
    /**
     * @class CylinderGeometry
     * @constructor
     */
    constructor();
    setAxis(axis: Cartesian3): CylinderGeometry;
    setPosition(position: Cartesian3): CylinderGeometry;
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): CylinderGeometry;
}
export = CylinderGeometry;
