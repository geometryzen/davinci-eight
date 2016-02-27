import Color from '../core/Color'
import VectorE3 from '../math/VectorE3'

/**
 * @class CylinderOptions
 */
interface CylinderOptions {
    /**
     *
     */
    axis?: VectorE3
    color?: Color
    radius?: number
    height?: number
}

export default CylinderOptions
