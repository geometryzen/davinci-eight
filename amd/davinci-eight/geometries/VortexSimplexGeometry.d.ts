import SimplexGeometry = require('../geometries/SimplexGeometry');
import Spinor3 = require('../math/Spinor3');
/**
 * @class VortexSimplexGeometry
 */
declare class VortexSimplexGeometry extends SimplexGeometry {
    radius: number;
    radiusCone: number;
    radiusShaft: number;
    lengthCone: number;
    lengthShaft: number;
    arrowSegments: number;
    radialSegments: number;
    generator: Spinor3;
    /**
     * @class VortexSimplexGeometry
     * @constructor
     * @param type [string = 'VortexSimplexGeometry']
     */
    constructor(type?: string);
    isModified(): boolean;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {ArrowSimplexGeometry}
     */
    setModified(modified: boolean): VortexSimplexGeometry;
    /**
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
}
export = VortexSimplexGeometry;
