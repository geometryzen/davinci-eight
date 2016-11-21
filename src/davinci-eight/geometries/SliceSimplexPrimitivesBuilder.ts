import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';

export default class SliceSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {

    public sliceAngle: number = 2 * Math.PI;

    constructor() {
        super();
    }
}
