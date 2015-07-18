import Geometry = require('../geometries/Geometry');
declare class CylinderGeometry extends Geometry {
    constructor(radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
}
export = CylinderGeometry;
