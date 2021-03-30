import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';

/**
 * @hidden
 */
export class SliceSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {

    public sliceAngle: number = 2 * Math.PI;

    constructor() {
        super();
    }
}
