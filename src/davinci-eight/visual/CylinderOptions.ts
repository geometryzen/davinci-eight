import Color from '../core/Color'
import VectorE3 from '../math/VectorE3'

/**
 * @class CylinderOptions
 */
interface CylinderOptions {

    /**
     * @attribute axis
     * @type VectorE3
     * @optional
     * @default e2
     */
    axis?: VectorE3

    /**
     * @attribute color
     * @type Color
     * @optional
     */
    color?: Color

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
     * @default 1
     */
    radius?: number

    /**
     * @attribute length
     * @type number
     * @optional
     * @default 1
     */
    length?: number
}

export default CylinderOptions
