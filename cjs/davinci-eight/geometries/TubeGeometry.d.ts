import Curve = require('../curves/Curve');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
declare class TubeGeometry extends Geometry {
    static NoTaper: (u: number) => number;
    static SinusoidalTaper: (u: number) => number;
    tangents: Vector3[];
    normals: Vector3[];
    binormals: Vector3[];
    constructor(path: Curve, segments?: number, radius?: number, radialSegments?: number, closed?: boolean, taper?: (u: number) => number);
}
export = TubeGeometry;
