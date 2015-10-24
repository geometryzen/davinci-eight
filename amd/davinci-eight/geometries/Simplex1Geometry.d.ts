import SimplexGeometry = require('../geometries/SimplexGeometry');
import R3 = require('../math/R3');
/**
 * @class Simplex1Geometry
 */
declare class Simplex1Geometry extends SimplexGeometry {
    head: R3;
    tail: R3;
    /**
     * @class Simplex1Geometry
     * @constructor
     */
    constructor();
    calculate(): void;
}
export = Simplex1Geometry;
