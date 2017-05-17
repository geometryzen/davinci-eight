import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { Vector3 } from '../math/Vector3';
export declare class Simplex1Geometry extends SimplexPrimitivesBuilder {
    head: Vector3;
    tail: Vector3;
    constructor();
    calculate(): void;
}
