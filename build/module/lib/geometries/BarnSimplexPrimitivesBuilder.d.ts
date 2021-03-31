import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { Geometric3 } from '../math/Geometric3';
/**
 * @hidden
 */
export declare class BarnSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    a: Geometric3;
    b: Geometric3;
    c: Geometric3;
    constructor();
    isModified(): boolean;
    setModified(modified: boolean): BarnSimplexPrimitivesBuilder;
    protected regenerate(): void;
}
