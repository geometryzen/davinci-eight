import Quaternion = require('../math/Quaternion');
import RevolutionGeometry = require('../geometries/RevolutionGeometry');
declare class ArrowGeometry extends RevolutionGeometry {
    constructor(scale: number, attitude: Quaternion, segments: number, length: number, radiusShaft: number, radiusCone: number, lengthCone: number, axis: {
        x: number;
        y: number;
        z: number;
    });
}
export = ArrowGeometry;
