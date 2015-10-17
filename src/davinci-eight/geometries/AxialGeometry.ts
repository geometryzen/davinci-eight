import Cartesian3 = require('../math/Cartesian3')
import Geometry = require('../geometries/Geometry')
import Vector3 = require('../math/Vector3')

/**
 * @class AxialGeometry
 * @extends Geometry
 */
class AxialGeometry extends Geometry {
    /**
     * The symmetry axis used for geometry generation.
     * @property axis
     * @type {Vector3}
     */
    public axis: Vector3;
    /**
     * <p>
     * A geometry which has axial symmetry, giving it an <code>axis</code> property.
     * </p>
     * <p>
     * Calls the base class constructor.
     * Provides the <code>type</code> to the <code>Geometry</code> base class.
     * Makes a copy of the axis, normalizes the copy and initializes the <code>axis</axis> property.
     * </p>
     * @class AxialGeometry
     * @constructor
     * @param type {string} Used for reference count tracking.
     * @param axis {Cartesian3} The <b>axis</b> property.
     */
    constructor(type: string, axis: Cartesian3) {
        super(type)
        this.axis = Vector3.copy(axis).normalize()
    }
    /**
     * <p>
     * Sets the <code>axis</code> property to <code>void 0</code>.
     * Calls the base class destructor method.
     * </p>
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }
}

export = AxialGeometry