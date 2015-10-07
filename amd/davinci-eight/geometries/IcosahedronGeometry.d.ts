import PolyhedronGeometry = require('../geometries/PolyhedronGeometry');
/**
 * @class IcosahedronGeometry
 * @extends PolyhedronGeometry
 */
declare class IcosahedronGeometry extends PolyhedronGeometry {
    /**
     * @class OcosahedronGeometry
     * @constructor
     * @param radius [number]
     * @param detail [number]
     */
    constructor(radius?: number, detail?: number);
}
export = IcosahedronGeometry;
