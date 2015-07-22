import Geometry = require('../geometries/Geometry');
declare class BoxGeometry extends Geometry {
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    constructor(width: number, height: number, depth: number, widthSegments?: number, heightSegments?: number, depthSegments?: number);
}
export = BoxGeometry;
