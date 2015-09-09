import Geometry3 = require('../geometries/Geometry3');
declare class SphereGeometry extends Geometry3 {
    constructor(radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number);
}
export = SphereGeometry;
