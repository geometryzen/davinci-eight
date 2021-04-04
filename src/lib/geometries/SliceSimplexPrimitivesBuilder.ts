import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';

/**
 * @hidden
 */
export abstract class SliceSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {

    public sliceAngle: number = 2 * Math.PI;

    constructor() {
        super();
    }
}
