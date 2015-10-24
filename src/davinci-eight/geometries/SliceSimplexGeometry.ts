import AxialSimplexGeometry = require('../geometries/AxialSimplexGeometry')
import VectorE3 = require('../math/VectorE3')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import isDefined = require('../checks/isDefined')
import mustBeNumber = require('../checks/mustBeNumber')
import R3 = require('../math/R3')

function perpendicular(axis: VectorE3) {
  return R3.random().cross(axis).normalize()
}

/**
 * @class SliceSimplexGeometry
 * @extends AxialSimplexGeometry
 */
class SliceSimplexGeometry extends AxialSimplexGeometry {
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
     * @type {R3}
     */
    public sliceStart: R3;
    /**
     * <p>
     * Calls the base class constructor.
     * </p>
     * <p>
     * Provides the <code>axis</code> to the <code>AxialSimplexGeometry</code> base class.
     * </p>
     * <p>
     * Provides the <code>type</code> to the <code>AxialSimplexGeometry</code> base class.
     * </p>
     * @class SliceSimplexGeometry
     * @constructor
     * @param type {string} Implementations must provide a type name used for reference count tracking.
     * @param axis [VectorE3 = R3.e3] The <code>axis</code> property.
     * @param sliceStart [VectorE3] The <code>sliceStart</code> property.
     * @param sliceAngle [number = 2 * Math.PI] The <code>sliceAngle</code> property.
     */
    constructor(type: string, axis: VectorE3 = R3.e3, sliceStart?: VectorE3, sliceAngle: number = 2 * Math.PI) {
        super(type, axis)
        if (isDefined(sliceStart)) {
          // TODO: Verify that sliceStart is orthogonal to axis.
          this.sliceStart = R3.copy(sliceStart).normalize()
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

export = SliceSimplexGeometry