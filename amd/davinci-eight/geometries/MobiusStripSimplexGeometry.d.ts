import GridSimplexGeometry = require('../geometries/GridSimplexGeometry');
/**
 * http://virtualmathmuseum.org/Surface/moebius_strip/moebius_strip.html
 */
declare class MobiusStripSimplexGeometry extends GridSimplexGeometry {
    constructor(uSegments: number, vSegments: number);
}
export = MobiusStripSimplexGeometry;
