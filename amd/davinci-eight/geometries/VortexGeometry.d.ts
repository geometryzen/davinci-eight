import Geometry3 = require('../geometries/Geometry3');
declare class VortexGeometry extends Geometry3 {
    constructor(radius?: number, radiusCone?: number, radiusShaft?: number, lengthCone?: number, lengthShaft?: number, arrowSegments?: number, radialSegments?: number);
}
export = VortexGeometry;
