import SimplexGeometry = require('../geometries/SimplexGeometry');
import SpinG3 = require('../math/SpinG3');
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
    generator: SpinG3;
    /**
     * @class VortexSimplexGeometry
     * @constructor
     */
    constructor();
    isModified(): boolean;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {VortexSimplexGeometry}
     */
    setModified(modified: boolean): VortexSimplexGeometry;
    /**
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
}
export = VortexSimplexGeometry;
