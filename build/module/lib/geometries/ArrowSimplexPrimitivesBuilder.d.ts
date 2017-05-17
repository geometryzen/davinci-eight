import { RevolutionSimplexPrimitivesBuilder } from '../geometries/RevolutionSimplexPrimitivesBuilder';
import { Vector3 } from '../math/Vector3';
export declare class ArrowSimplexPrimitivesBuilder extends RevolutionSimplexPrimitivesBuilder {
    lengthCone: number;
    radiusCone: number;
    radiusShaft: number;
    vector: Vector3;
    segments: number;
    private modified_;
    constructor();
    isModified(): boolean;
    setModified(modified: boolean): ArrowSimplexPrimitivesBuilder;
    protected regenerate(): void;
}
