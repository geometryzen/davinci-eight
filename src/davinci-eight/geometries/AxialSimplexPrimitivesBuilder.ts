import CartesianE3 from '../math/CartesianE3';
import VectorE3 from '../math/VectorE3';
import IAxialGeometry from '../geometries/IAxialGeometry';
import mustBeObject from '../checks/mustBeObject';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';

export default class AxialSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder implements IAxialGeometry<AxialSimplexPrimitivesBuilder> {

    public axis: CartesianE3;

    constructor(axis: VectorE3) {
        super()
        this.setAxis(axis)
    }

    setAxis(axis: VectorE3): AxialSimplexPrimitivesBuilder {
        mustBeObject('axis', axis)
        this.axis = CartesianE3.direction(axis)
        return this
    }

    setPosition(position: VectorE3): AxialSimplexPrimitivesBuilder {
        super.setPosition(position)
        return this
    }

    enableTextureCoords(enable: boolean): AxialSimplexPrimitivesBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
