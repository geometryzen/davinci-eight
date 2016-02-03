import AxialSimplexGeometry from '../geometries/AxialSimplexGeometry';
import VectorE3 from '../math/VectorE3';
import isDefined from '../checks/isDefined';
import mustBeNumber from '../checks/mustBeNumber';
import R3 from '../math/R3';

function perpendicular(axis: VectorE3) {
    return R3.random().cross(axis).direction()
}

/**
 * @class SliceSimplexGeometry
 * @extends AxialSimplexGeometry
 */
export default class SliceSimplexGeometry extends AxialSimplexGeometry {
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
     * @param [axis = e3] {VectorE3} The <code>axis</code> property.
     * @param [sliceStart] {VectorE3} The <code>sliceStart</code> property.
     * @param [sliceAngle = 2 * Math.PI] {number} The <code>sliceAngle</code> property.
     */
    constructor(axis: VectorE3 = R3.e3, sliceStart?: VectorE3, sliceAngle: number = 2 * Math.PI) {
        super(axis)
        if (isDefined(sliceStart)) {
            // TODO: Verify that sliceStart is orthogonal to axis.
            this.sliceStart = R3.copy(sliceStart).direction()
        }
        else {
            this.sliceStart = perpendicular(this.axis)
        }
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle)
    }
}
