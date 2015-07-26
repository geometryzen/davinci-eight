import Geometry = require('../geometries/Geometry');
declare class VortexGeometry extends Geometry {
    constructor(radius?: number, radiusCone?: number, radiusShaft?: number, lengthCone?: number, lengthShaft?: number, arrowSegments?: number, radialSegments?: number);
}
export = VortexGeometry;
