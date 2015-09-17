import Geometry = require('../geometries/Geometry');
declare class SphereGeometry extends Geometry {
    constructor(radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number);
}
export = SphereGeometry;
