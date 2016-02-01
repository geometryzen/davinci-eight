import CartesianE3 from '../math/CartesianE3';
import VectorE3 from '../math/VectorE3';
import IAxialGeometry from '../geometries/IAxialGeometry';
import mustBeObject from '../checks/mustBeObject';
import SimplexGeometry from '../geometries/SimplexGeometry';

/**
 * @class AxialSimplexGeometry
 * @extends SimplexGeometry
 */
export default class AxialSimplexGeometry extends SimplexGeometry implements IAxialGeometry<AxialSimplexGeometry> {
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
     * Provides the <code>type</code> to the <code>SimplexGeometry</code> base class.
     * Makes a copy of the axis, normalizes the copy and initializes the <code>axis</axis> property.
     * </p>
     * @class AxialSimplexGeometry
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
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): AxialSimplexGeometry {
        mustBeObject('axis', axis)
        this.axis = CartesianE3.direction(axis)
        return this
    }

    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): AxialSimplexGeometry {
        super.setPosition(position)
        return this
    }

    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): AxialSimplexGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
