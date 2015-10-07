import Cartesian3 = require('../math/Cartesian3');
import Geometry = require('../geometries/Geometry');
/**
 * @class SurfaceGeometry
 */
declare class SurfaceGeometry extends Geometry {
    /**
     * @class SurfaceGeometry
     * @constructor
     * @param parametricFunction {(u: number, v: number) => Cartesian3}
     * @param uSegments {number}
     * @param vSegments {number}
     */
    constructor(parametricFunction: (u: number, v: number) => Cartesian3, uSegments: number, vSegments: number);
}
export = SurfaceGeometry;
