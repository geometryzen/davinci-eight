import SurfaceGeometry = require('../geometries/SurfaceGeometry');
/**
 * By connecting the edge of a Mobius Strip we get a Klein Bottle.
 * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
 * @class KleinBottleGeometry
 * @extends SurfaceGeometry
 */
declare class KleinBottleGeometry extends SurfaceGeometry {
    /**
     * @class KleinBottleGeometry
     * @constructor
     * @param uSegments {number}
     * @param vSegments {number}
     */
    constructor(uSegments: number, vSegments: number);
}
export = KleinBottleGeometry;
