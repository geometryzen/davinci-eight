import { SliceSimplexPrimitivesBuilder } from '../geometries/SliceSimplexPrimitivesBuilder';
import { VectorE3 } from '../math/VectorE3';
export declare class ConeSimplexGeometry extends SliceSimplexPrimitivesBuilder {
    radiusTop: number;
    radius: number;
    height: number;
    openCap: boolean;
    openBase: boolean;
    thetaStart: number;
    constructor(radius: number, height: number, axis: VectorE3, radiusTop?: number, openCap?: boolean, openBase?: boolean, thetaStart?: number);
    protected regenerate(): void;
}
