import Geometry = require('../geometries/Geometry');
import Spinor3 = require('../math/Spinor3');
import Vector3 = require('../math/Vector3');
/**
 * @class RevolutionGeometry
 */
declare class RevolutionGeometry extends Geometry {
    /**
     * @class RevolutionGeometry
     * @constructor
     * @param points {Vector3[]}
     * @param generator {Spinor3}
     * @param segments {number}
     * @param phiStart {number}
     * @param phiLength {number}
     * @param attitude {Spinor3}
     */
    constructor(points: Vector3[], generator: Spinor3, segments: number, phiStart: number, phiLength: number, attitude: Spinor3);
}
export = RevolutionGeometry;
