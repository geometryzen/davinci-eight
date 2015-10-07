import RevolutionGeometry = require('../geometries/RevolutionGeometry');
import Spinor3 = require('../math/Spinor3');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @class ArrowGeometry
 */
declare class ArrowGeometry extends RevolutionGeometry {
    /**
     * @class ArrowGeometry
     * @constructor
     * @param scale {number}
     * @param attitude {Spinor3}
     * @param segments {number}
     * @param radiusShaft {number}
     * @param radiusCone {number}
     * @param lengthCone {number}
     * @param axis {Cartesian3}
     */
    constructor(scale?: number, attitude?: Spinor3, segments?: number, length?: number, radiusShaft?: number, radiusCone?: number, lengthCone?: number, axis?: Cartesian3);
}
export = ArrowGeometry;
