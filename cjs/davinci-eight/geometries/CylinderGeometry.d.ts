import Geometry3 = require('../geometries/Geometry3');
declare class CylinderGeometry extends Geometry3 {
    constructor(radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
}
export = CylinderGeometry;
