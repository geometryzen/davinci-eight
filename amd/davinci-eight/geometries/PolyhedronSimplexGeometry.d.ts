import SimplexGeometry = require('../geometries/SimplexGeometry');
/**
 * @class PolyhedronSimplexGeometry
 * @extends SimplexGeometry
 */
declare class PolyhedronSimplexGeometry extends SimplexGeometry {
    /**
     * @class PolyhedronSimplexGeometry
     * @constructor
     *
     */
    constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
}
export = PolyhedronSimplexGeometry;
