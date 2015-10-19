import Cartesian3 = require('../math/Cartesian3');
import SimplexGeometry = require('../geometries/SimplexGeometry');
/**
 * @class GridSimplexGeometry
 */
declare class GridSimplexGeometry extends SimplexGeometry {
    /**
     * @class GridSimplexGeometry
     * @constructor
     * @param parametricFunction {(u: number, v: number) => Cartesian3}
     * @param uSegments {number}
     * @param vSegments {number}
     */
    constructor(parametricFunction: (u: number, v: number) => Cartesian3, uSegments: number, vSegments: number);
}
export = GridSimplexGeometry;
