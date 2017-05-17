import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';

export class SliceSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {

    public sliceAngle: number = 2 * Math.PI;

    constructor() {
        super();
    }
}
