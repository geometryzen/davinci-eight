import PolyhedronSimplexGeometry = require('../geometries/PolyhedronSimplexGeometry');
/**
 * @class IcosahedronSimplexGeometry
 * @extends PolyhedronSimplexGeometry
 */
declare class IcosahedronSimplexGeometry extends PolyhedronSimplexGeometry {
    /**
     * @class OcosahedronGeometry
     * @constructor
     * @param radius [number]
     * @param detail [number]
     */
    constructor(radius?: number, detail?: number);
}
export = IcosahedronSimplexGeometry;
