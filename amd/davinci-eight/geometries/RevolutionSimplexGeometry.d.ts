import SimplexGeometry = require('../geometries/SimplexGeometry');
import SpinG3 = require('../math/SpinG3');
import R3 = require('../math/R3');
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
     * @param points {R3[]}
     * @param generator {SpinG3}
     * @param segments {number}
     * @param phiStart {number}
     * @param phiLength {number}
     * @param attitude {SpinG3}
     */
    protected revolve(points: R3[], generator: SpinG3, segments: number, phiStart: number, phiLength: number, attitude: SpinG3): void;
}
export = RevolutionSimplexGeometry;
