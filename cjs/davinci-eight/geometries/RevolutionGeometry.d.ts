import Geometry3 = require('../geometries/Geometry3');
import Spinor3 = require('../math/Spinor3');
import Vector3 = require('../math/Vector3');
declare class RevolutionGeometry extends Geometry3 {
    constructor(points: Vector3[], generator: Spinor3, segments: number, phiStart: number, phiLength: number, attitude: Spinor3);
}
export = RevolutionGeometry;
