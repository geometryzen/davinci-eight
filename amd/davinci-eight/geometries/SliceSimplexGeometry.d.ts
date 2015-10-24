import AxialSimplexGeometry = require('../geometries/AxialSimplexGeometry');
import VectorE3 = require('../math/VectorE3');
import R3 = require('../math/R3');
/**
 * @class SliceSimplexGeometry
 * @extends AxialSimplexGeometry
 */
declare class SliceSimplexGeometry extends AxialSimplexGeometry {
    /**
     * <p>
     * The angle of the slice, measured in radians.
     * </p>
     * @property sliceAngle
     * @type {number}
     */
    sliceAngle: number;
    /**
     * <p>
     * The (unit vector) direction of the start of the slice.
     * </p>
     * @property sliceStart
     * @type {R3}
     */
    sliceStart: R3;
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
    constructor(type: string, axis?: VectorE3, sliceStart?: VectorE3, sliceAngle?: number);
    /**
     * <p>
     * Calls the base class destructor method.
     * </p>
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
}
export = SliceSimplexGeometry;
