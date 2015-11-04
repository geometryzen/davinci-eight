import CartesianE3 = require('../math/CartesianE3');
import VectorE3 = require('../math/VectorE3');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import SimplexGeometry = require('../geometries/SimplexGeometry');
/**
 * @class AxialSimplexGeometry
 * @extends SimplexGeometry
 */
declare class AxialSimplexGeometry extends SimplexGeometry implements IAxialGeometry<AxialSimplexGeometry> {
    /**
     * The symmetry axis used for geometry generation.
     * @property axis
     * @type {CartesianE3}
     */
    axis: CartesianE3;
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
    constructor(axis: VectorE3);
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): AxialSimplexGeometry;
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): AxialSimplexGeometry;
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): AxialSimplexGeometry;
}
export = AxialSimplexGeometry;
