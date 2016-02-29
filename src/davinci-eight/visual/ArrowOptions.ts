import IColor from '../core/IColor'
import VectorE3 from '../math/VectorE3'

/**
 * @class ArrowOptions
 */
interface ArrowOptions {

    /**
     * @attribute axis
     * @type VectorE3
     * @optional
     * @default e2
     */
    axis?: VectorE3

    /**
     * @attribute color
     * @type IColor
     * @optional
     */
    color?: IColor

    /**
     * @attribute position
     * @type VectorE3
     * @optional
     * @default 0
     */
    position?: VectorE3
}

export default ArrowOptions
