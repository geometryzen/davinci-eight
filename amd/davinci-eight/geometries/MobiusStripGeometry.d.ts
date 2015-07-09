import ParametricGeometry = require('../geometries/ParametricGeometry');
/**
 * http://virtualmathmuseum.org/Surface/moebius_strip/moebius_strip.html
 */
declare class MobiusStripGeometry extends ParametricGeometry {
    constructor(uSegments: number, vSegments: number);
}
export = MobiusStripGeometry;
