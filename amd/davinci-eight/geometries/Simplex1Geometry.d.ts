import SimplexGeometry = require('../geometries/SimplexGeometry');
import Vector3 = require('../math/Vector3');
/**
 * @class Simplex1Geometry
 */
declare class Simplex1Geometry extends SimplexGeometry {
    head: Vector3;
    tail: Vector3;
    /**
     * @class Simplex1Geometry
     * @constructor
     */
    constructor();
    calculate(): void;
}
export = Simplex1Geometry;
