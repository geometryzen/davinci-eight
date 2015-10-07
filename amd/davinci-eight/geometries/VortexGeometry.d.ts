import Geometry = require('../geometries/Geometry');
/**
 * @class VortexGeometry
 */
declare class VortexGeometry extends Geometry {
    /**
     * @class VortexGeometry
     * @constructor
     * @param radius [number = 1]
     * @param radiusCone [number = 0.08]
     * @param radiusShaft [number = 0.01]
     * @param lengthCone [number = 0.2]
     * @param lengthShaft [number = 0.8]
     * @param arrowSegments [number = 8]
     * @param radialSegments [number = 12]
     */
    constructor(radius?: number, radiusCone?: number, radiusShaft?: number, lengthCone?: number, lengthShaft?: number, arrowSegments?: number, radialSegments?: number);
}
export = VortexGeometry;
