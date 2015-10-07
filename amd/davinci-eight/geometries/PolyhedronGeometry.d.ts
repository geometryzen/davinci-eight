import Geometry = require('../geometries/Geometry');
/**
 * @class PolyhedronGeometry
 * @extends Geometry
 */
declare class PolyhedronGeometry extends Geometry {
    /**
     * @class PolyhedronGeometry
     * @constructor
     *
     */
    constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
}
export = PolyhedronGeometry;
