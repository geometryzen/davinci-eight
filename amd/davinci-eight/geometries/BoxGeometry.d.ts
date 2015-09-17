import Geometry = require('../geometries/Geometry');
/**
 * @class BoxGeometry
 * @extends Geometry
 */
declare class BoxGeometry extends Geometry {
    constructor(width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number, wireFrame?: boolean);
}
export = BoxGeometry;
