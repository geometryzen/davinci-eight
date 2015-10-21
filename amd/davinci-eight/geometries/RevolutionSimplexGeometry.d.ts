import SimplexGeometry = require('../geometries/SimplexGeometry');
import MutableSpinorE3 = require('../math/MutableSpinorE3');
import MutableVectorE3 = require('../math/MutableVectorE3');
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
     * @param points {MutableVectorE3[]}
     * @param generator {MutableSpinorE3}
     * @param segments {number}
     * @param phiStart {number}
     * @param phiLength {number}
     * @param attitude {MutableSpinorE3}
     */
    protected revolve(points: MutableVectorE3[], generator: MutableSpinorE3, segments: number, phiStart: number, phiLength: number, attitude: MutableSpinorE3): void;
}
export = RevolutionSimplexGeometry;
