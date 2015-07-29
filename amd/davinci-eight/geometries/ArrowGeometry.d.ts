import RevolutionGeometry = require('../geometries/RevolutionGeometry');
import Spinor3 = require('../math/Spinor3');
import Cartesian3 = require('../math/Cartesian3');
declare class ArrowGeometry extends RevolutionGeometry {
    constructor(scale?: number, attitude?: Spinor3, segments?: number, length?: number, radiusShaft?: number, radiusCone?: number, lengthCone?: number, axis?: Cartesian3);
}
export = ArrowGeometry;
