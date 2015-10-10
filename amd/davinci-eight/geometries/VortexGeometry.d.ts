import Geometry = require('../geometries/Geometry');
import Spinor3 = require('../math/Spinor3');
/**
 * @class VortexGeometry
 */
declare class VortexGeometry extends Geometry {
    radius: number;
    radiusCone: number;
    radiusShaft: number;
    lengthCone: number;
    lengthShaft: number;
    arrowSegments: number;
    radialSegments: number;
    generator: Spinor3;
    /**
     * @class VortexGeometry
     * @constructor
     * @param type [string = 'VortexGeometry']
     */
    constructor(type?: string);
    isModified(): boolean;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {ArrowGeometry}
     */
    setModified(modified: boolean): VortexGeometry;
    /**
     * @method recalculate
     * @return {void}
     */
    recalculate(): void;
}
export = VortexGeometry;
