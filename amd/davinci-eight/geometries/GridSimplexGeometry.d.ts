import VectorE3 = require('../math/VectorE3');
import SimplexGeometry = require('../geometries/SimplexGeometry');
/**
 * @class GridSimplexGeometry
 */
declare class GridSimplexGeometry extends SimplexGeometry {
    /**
     * @class GridSimplexGeometry
     * @constructor
     * @param parametricFunction {(u: number, v: number) => VectorE3}
     * @param uSegments {number}
     * @param vSegments {number}
     */
    constructor(parametricFunction: (u: number, v: number) => VectorE3, uSegments: number, vSegments: number);
}
export = GridSimplexGeometry;
