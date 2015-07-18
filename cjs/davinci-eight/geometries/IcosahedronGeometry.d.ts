import PolyhedronGeometry = require('../geometries/PolyhedronGeometry');
declare class IcosahedronGeometry extends PolyhedronGeometry {
    type: string;
    constructor(radius?: number, detail?: number);
}
export = IcosahedronGeometry;
