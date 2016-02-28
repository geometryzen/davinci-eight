import ColorRGB from '../core/ColorRGB'
import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'

/**
 * The options for creating a Sphere.
 *
 * @class SphereOptions
 */
interface SphereOptions {

    /**
     * @attribute color
     * @type ColorRGB
     * @optional
     */
    color?: ColorRGB

    /**
     * @attribute offset
     * @type VectorE3
     * @optional
     * @default 0
     */
    offset?: VectorE3

    /**
     * @attribute position
     * @type VectorE3
     * @optional
     * @default 0
     */
    position?: VectorE3

    /**
     * @attribute radius
     * @type number
     * @optional
     * @default 0.5
     */
    radius?: number

    scale?: VectorE3
    tilt?: SpinorE3
}

export default SphereOptions
