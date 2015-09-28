import Geometry = require('../dfx/Geometry');
/**
 * @class CuboidGeometry
 * @extends Geometry
 */
declare class CuboidGeometry extends Geometry {
    constructor(x?: number, y?: number, z?: number, xSeg?: number, ySeg?: number, zSeg?: number, wireFrame?: boolean);
}
export = CuboidGeometry;
