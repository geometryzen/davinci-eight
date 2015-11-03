import RevolutionSimplexGeometry = require('../geometries/RevolutionSimplexGeometry');
import R3 = require('../math/R3');
/**
 * Intentionally undocumented.
 *
 * This doesn't work because of the difficulty of constructing normals.
 * With more information, RevolutionSimplexGeometry might do the job.
 */
declare class ArrowSimplexGeometry extends RevolutionSimplexGeometry {
    lengthCone: number;
    radiusCone: number;
    radiusShaft: number;
    vector: R3;
    segments: number;
    constructor();
    isModified(): boolean;
    setModified(modified: boolean): ArrowSimplexGeometry;
    regenerate(): void;
}
export = ArrowSimplexGeometry;
