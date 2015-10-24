import RevolutionSimplexGeometry = require('../geometries/RevolutionSimplexGeometry');
import R3 = require('../math/R3');
/**
 * @class ArrowSimplexGeometry
 */
declare class ArrowSimplexGeometry extends RevolutionSimplexGeometry {
    lengthCone: number;
    radiusCone: number;
    radiusShaft: number;
    /**
     * @property vector
     * @type {R3}
     */
    vector: R3;
    segments: number;
    /**
     * @class ArrowSimplexGeometry
     * @constructor
     */
    constructor();
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method isModified
     * @return {boolean}
     */
    isModified(): boolean;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {ArrowSimplexGeometry}
     */
    setModified(modified: boolean): ArrowSimplexGeometry;
    /**
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
}
export = ArrowSimplexGeometry;
