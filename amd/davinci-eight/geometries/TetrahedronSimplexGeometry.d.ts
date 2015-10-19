import PolyhedronSimplexGeometry = require('../geometries/PolyhedronSimplexGeometry');
/**
 * @class TetrahedronSimplexGeometry
 * @extends PolyhedronSimplexGeometry
 */
declare class TetrahedronSimplexGeometry extends PolyhedronSimplexGeometry {
    /**
     * @class TetrahedronSimplexGeometry
     * @constructor
     * @param radius [number]
     * @param detail [number]
     */
    constructor(radius?: number, detail?: number);
}
export = TetrahedronSimplexGeometry;
