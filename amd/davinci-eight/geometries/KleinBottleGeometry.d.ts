import ParametricGeometry = require('../geometries/ParametricGeometry');
/**
 * By connecting the edge of a Mobius Strip we get a Klein Bottle.
 * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
 */
declare class KleinBottleGeometry extends ParametricGeometry {
    constructor(uSegments: number, vSegments: number);
}
export = KleinBottleGeometry;
