import Geometry = require('../geometries/Geometry');
import Spinor3 = require('../math/Spinor3');
import Vector3 = require('../math/Vector3');
declare class RevolutionGeometry extends Geometry {
    constructor(points: Vector3[], generator: Spinor3, segments: number, phiStart: number, phiLength: number, attitude: Spinor3);
}
export = RevolutionGeometry;
