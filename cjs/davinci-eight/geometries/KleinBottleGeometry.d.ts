import ParametricGeometry = require('../geometries/ParametricGeometry');
/**
 * By connecting the edge of a Mobius Strip we get a Klein Bottle.
 * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
 * @class KleinBottleGeometry
 * @extends ParametricGeometry
 */
declare class KleinBottleGeometry extends ParametricGeometry {
    /**
     * @class KleinBottleGeometry
     * @constructor
     * @param uSegments {number}
     * @param vSegments {number}
     */
    constructor(uSegments: number, vSegments: number);
}
export = KleinBottleGeometry;
