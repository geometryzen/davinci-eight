import GridSimplexGeometry = require('../geometries/GridSimplexGeometry');
/**
 * By connecting the edge of a Mobius Strip we get a Klein Bottle.
 * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
 * @class KleinBottleSimplexGeometry
 * @extends GridSimplexGeometry
 */
declare class KleinBottleSimplexGeometry extends GridSimplexGeometry {
    /**
     * @class KleinBottleSimplexGeometry
     * @constructor
     * @param uSegments {number}
     * @param vSegments {number}
     */
    constructor(uSegments: number, vSegments: number);
}
export = KleinBottleSimplexGeometry;
