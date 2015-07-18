import Geometry = require('../geometries/Geometry');
declare class PolyhedronGeometry extends Geometry {
    type: string;
    parameters: any;
    constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
}
export = PolyhedronGeometry;
