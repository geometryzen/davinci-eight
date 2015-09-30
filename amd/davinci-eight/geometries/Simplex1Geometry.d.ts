import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
/**
 * @class Simplex1Geometry
 */
declare class Simplex1Geometry extends Geometry {
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
