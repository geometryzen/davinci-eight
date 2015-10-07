import SurfaceGeometry = require('../geometries/SurfaceGeometry');
/**
 * http://virtualmathmuseum.org/Surface/moebius_strip/moebius_strip.html
 */
declare class MobiusStripGeometry extends SurfaceGeometry {
    constructor(uSegments: number, vSegments: number);
}
export = MobiusStripGeometry;
