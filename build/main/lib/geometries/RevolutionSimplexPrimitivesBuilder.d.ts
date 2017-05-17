import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
export declare class RevolutionSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    constructor();
    protected revolve(points: Vector3[], generator: Spinor3, segments: number, phiStart: number, phiLength: number, attitude: Spinor3): void;
}
