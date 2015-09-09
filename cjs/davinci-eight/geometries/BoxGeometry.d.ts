import Geometry3 = require('../geometries/Geometry3');
declare class BoxGeometry extends Geometry3 {
    constructor(width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number, wireFrame?: boolean);
}
export = BoxGeometry;
