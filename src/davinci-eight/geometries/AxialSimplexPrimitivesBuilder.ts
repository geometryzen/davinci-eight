import CartesianE3 from '../math/CartesianE3';
import VectorE3 from '../math/VectorE3';
import IAxialGeometry from '../geometries/IAxialGeometry';
import mustBeObject from '../checks/mustBeObject';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';

/**
 * @module EIGHT
 * @submodule geometries
 */

/**
 * @class AxialSimplexPrimitivesBuilder
 * @extends SimplexPrimitivesBuilder
 */
export default class AxialSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder implements IAxialGeometry<AxialSimplexPrimitivesBuilder> {
    /**
     * The symmetry axis used for geometry generation.
     * @property axis
     * @type {CartesianE3}
     */
    public axis: CartesianE3;

    /**
     * <p>
     * A geometry which has axial symmetry, giving it an <code>axis</code> property.
     * </p>
     * <p>
     * Calls the base class constructor.
     * Provides the <code>type</code> to the <code>SimplexPrimitivesBuilder</code> base class.
     * Makes a copy of the axis, normalizes the copy and initializes the <code>axis</axis> property.
     * </p>
     * @class AxialSimplexPrimitivesBuilder
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity. 
     */
    constructor(axis: VectorE3) {
        super()
        this.setAxis(axis)
    }

    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {AxialSimplexPrimitivesBuilder}
     * @chainable
     */
    setAxis(axis: VectorE3): AxialSimplexPrimitivesBuilder {
        mustBeObject('axis', axis)
        this.axis = CartesianE3.direction(axis)
        return this
    }

    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {AxialSimplexPrimitivesBuilder}
     * @chainable
     */
    setPosition(position: VectorE3): AxialSimplexPrimitivesBuilder {
        super.setPosition(position)
        return this
    }

    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialSimplexPrimitivesBuilder}
     * @chainable
     */
    enableTextureCoords(enable: boolean): AxialSimplexPrimitivesBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
