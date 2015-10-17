import AxialGeometry = require('../geometries/AxialGeometry')
import Cartesian3 = require('../math/Cartesian3')
import Geometry = require('../geometries/Geometry')
import isDefined = require('../checks/isDefined')
import mustBeNumber = require('../checks/mustBeNumber')
import Vector3 = require('../math/Vector3')

function perpendicular(axis: Cartesian3) {
  return Vector3.random().cross(axis).normalize()
}

/**
 * @class SliceGeometry
 * @extends AxialGeometry
 */
class SliceGeometry extends AxialGeometry {
    /**
     * <p>
     * The angle of the slice, measured in radians.
     * </p>
     * @property sliceAngle
     * @type {number}
     */
    public sliceAngle: number = 2 * Math.PI;
    /**
     * <p>
     * The (unit vector) direction of the start of the slice.
     * </p>
     * @property sliceStart
     * @type {Vector3}
     */
    public sliceStart: Vector3;
    /**
     * <p>
     * Calls the base class constructor.
     * </p>
     * <p>
     * Provides the <code>axis</code> to the <code>AxialGeometry</code> base class.
     * </p>
     * <p>
     * Provides the <code>type</code> to the <code>AxialGeometry</code> base class.
     * </p>
     * @class SliceGeometry
     * @constructor
     * @param type {string} Implementations must provide a type name used for reference count tracking.
     * @param axis [Cartesian3 = Vector3.e3] The <code>axis</code> property.
     * @param sliceStart [Cartesian3] The <code>sliceStart</code> property.
     * @param sliceAngle [number = 2 * Math.PI] The <code>sliceAngle</code> property.
     */
    constructor(type: string, axis: Cartesian3 = Vector3.e3, sliceStart?: Cartesian3, sliceAngle: number = 2 * Math.PI) {
        super(type, axis)
        if (isDefined(sliceStart)) {
          // TODO: Verify that sliceStart is orthogonal to axis.
          this.sliceStart = Vector3.copy(sliceStart).normalize()
        }
        else {
          this.sliceStart = perpendicular(this.axis)
        }
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle)
    }
    /**
     * <p>
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

export = SliceGeometry