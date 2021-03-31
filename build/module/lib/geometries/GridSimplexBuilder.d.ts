import { VectorE3 } from '../math/VectorE3';
import { SimplexPrimitivesBuilder } from './SimplexPrimitivesBuilder';
/**
 * @hidden
 */
export declare class GridSimplexBuilder extends SimplexPrimitivesBuilder {
    constructor(parametricFunction: (u: number, v: number) => VectorE3, uSegments: number, vSegments: number);
}
