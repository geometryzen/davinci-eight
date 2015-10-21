import Cartesian3 = require('../math/Cartesian3');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import SimplexGeometry = require('../geometries/SimplexGeometry');
import Vector3 = require('../math/Vector3');
/**
 * @class AxialSimplexGeometry
 * @extends SimplexGeometry
 */
declare class AxialSimplexGeometry extends SimplexGeometry implements IAxialGeometry<AxialSimplexGeometry> {
    /**
     * The symmetry axis used for geometry generation.
     * @property axis
     * @type {Vector3}
     */
    axis: Vector3;
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
     * @param type {string} Used for reference count tracking.
     * @param axis {Cartesian3} The <b>axis</b> property.
     */
    constructor(type: string, axis: Cartesian3);
    /**
     * <p>
     * Sets the <code>axis</code> property to <code>void 0</code>.
     * Calls the base class destructor method.
     * </p>
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method setAxis
     * @param axis {Cartesian3}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    setAxis(axis: Cartesian3): AxialSimplexGeometry;
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    setPosition(position: Cartesian3): AxialSimplexGeometry;
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): AxialSimplexGeometry;
}
export = AxialSimplexGeometry;
