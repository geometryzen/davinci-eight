import Geometry = require('../geometries/Geometry');
declare class BoxGeometry extends Geometry {
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    constructor(width: any, height: any, depth: any, widthSegments: any, heightSegments: any, depthSegments: any);
}
export = BoxGeometry;
