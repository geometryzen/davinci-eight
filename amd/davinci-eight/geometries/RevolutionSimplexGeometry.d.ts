import SimplexGeometry = require('../geometries/SimplexGeometry');
import Spinor3 = require('../math/Spinor3');
import Vector3 = require('../math/Vector3');
/**
 * @class RevolutionSimplexGeometry
 */
declare class RevolutionSimplexGeometry extends SimplexGeometry {
    /**
     * @class RevolutionSimplexGeometry
     * @constructor
     */
    constructor(type?: string);
    /**
     * @method revolve
     * @param points {Vector3[]}
     * @param generator {Spinor3}
     * @param segments {number}
     * @param phiStart {number}
     * @param phiLength {number}
     * @param attitude {Spinor3}
     */
    protected revolve(points: Vector3[], generator: Spinor3, segments: number, phiStart: number, phiLength: number, attitude: Spinor3): void;
}
export = RevolutionSimplexGeometry;
