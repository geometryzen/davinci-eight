import PolyhedronGeometry = require('../geometries/PolyhedronGeometry');
/**
 * @class TetrahedronGeometry
 * @extends PolyhedronGeometry
 */
declare class TetrahedronGeometry extends PolyhedronGeometry {
    /**
     * @class TetrahedronGeometry
     * @constructor
     * @param radius [number]
     * @param detail [number]
     */
    constructor(radius?: number, detail?: number);
}
export = TetrahedronGeometry;
