import Geometry = require('../geometries/Geometry');
/**
 * @class CylinderGeometry
 */
declare class CylinderGeometry extends Geometry {
    /**
     * @class CylinderGeometry
     * @constructor
     * @param radiusTop [number = 1]
     * @param radiusBottom [number = 1]
     * @param height [number = 1]
     * @param radialSegments [number = 16]
     * @param heightSegments [number = 1]
     * @param openEnded [boolean = false]
     * @param thetaStart [number = 0]
     * @param thetaLength [number = 2 * Math.PI]
     */
    constructor(radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
}
export = CylinderGeometry;
