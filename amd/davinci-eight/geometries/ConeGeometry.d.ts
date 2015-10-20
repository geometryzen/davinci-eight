import AxialGeometry = require('../geometries/AxialGeometry');
import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IGeometry = require('../geometries/IGeometry');
/**
 * @class ConeGeometry
 */
declare class ConeGeometry extends AxialGeometry implements IGeometry<ConeGeometry> {
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
     * @class ConeGeometry
     * @constructor
     */
    constructor();
    setPosition(position: Cartesian3): ConeGeometry;
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): ConeGeometry;
}
export = ConeGeometry;
