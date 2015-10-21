import SimplexGeometry = require('../geometries/SimplexGeometry');
import MutableVectorE3 = require('../math/MutableVectorE3');
/**
 * @class Simplex1Geometry
 */
declare class Simplex1Geometry extends SimplexGeometry {
    head: MutableVectorE3;
    tail: MutableVectorE3;
    /**
     * @class Simplex1Geometry
     * @constructor
     */
    constructor();
    calculate(): void;
}
export = Simplex1Geometry;
