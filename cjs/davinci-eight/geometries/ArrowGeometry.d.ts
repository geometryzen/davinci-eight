import RevolutionGeometry = require('../geometries/RevolutionGeometry');
import Spinor3 = require('../math/Spinor3');
declare class ArrowGeometry extends RevolutionGeometry {
    constructor(scale: number, attitude: Spinor3, segments: number, length: number, radiusShaft: number, radiusCone: number, lengthCone: number, axis: {
        x: number;
        y: number;
        z: number;
    });
}
export = ArrowGeometry;
