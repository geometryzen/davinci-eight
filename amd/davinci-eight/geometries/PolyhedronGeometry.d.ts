import Geometry3 = require('../geometries/Geometry3');
declare class PolyhedronGeometry extends Geometry3 {
    constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
}
export = PolyhedronGeometry;
