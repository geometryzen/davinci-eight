import ParametricSurfaceGeometry = require('../geometries/ParametricSurfaceGeometry');
/**
 * http://virtualmathmuseum.org/Surface/moebius_strip/moebius_strip.html
 */
declare class MobiusStripGeometry extends ParametricSurfaceGeometry {
    constructor(uSegments: number, vSegments: number);
}
export = MobiusStripGeometry;
