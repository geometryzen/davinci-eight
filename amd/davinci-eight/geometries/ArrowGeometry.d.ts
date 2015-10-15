import RevolutionGeometry = require('../geometries/RevolutionGeometry');
import Vector3 = require('../math/Vector3');
/**
 * @class ArrowGeometry
 */
declare class ArrowGeometry extends RevolutionGeometry {
    lengthCone: number;
    radiusCone: number;
    radiusShaft: number;
    /**
     * @property vector
     * @type {Vector3}
     */
    vector: Vector3;
    segments: number;
    /**
     * @class ArrowGeometry
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
     * @return {ArrowGeometry}
     */
    setModified(modified: boolean): ArrowGeometry;
    /**
     * @method recalculate
     * @return {void}
     */
    recalculate(): void;
}
export = ArrowGeometry;
