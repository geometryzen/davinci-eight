import Geometry = require('../geometries/Geometry');
/**
 * @class SphereGeometry
 * @extends Geometry
 */
declare class SphereGeometry extends Geometry {
    /**
     * Constructs a geometry consisting of triangular simplices based on spherical coordinates.
     * @class SphereGeometry
     * @constructor
     * @param radius [number = 1]
     * @param widthSegments [number = 16]
     * @param heightSegments [number = 12]
     * @param phiStart [number = 0]
     * @param phiLength [number = 2 * Math.PI]
     * @param thetaStart [number = 0]
     * @param thetaLength [number = Math.PI]
     */
    constructor(radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number);
}
export = SphereGeometry;
