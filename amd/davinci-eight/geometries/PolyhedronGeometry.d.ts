import Geometry = require('../geometries/Geometry');
declare class PolyhedronGeometry extends Geometry {
    constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
}
export = PolyhedronGeometry;
