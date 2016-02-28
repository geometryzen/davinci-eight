import Color from '../core/Color'
import VectorE3 from '../math/VectorE3'

/**
 * @class BoxOptions
 */
interface BoxOptions {

    /**
     * @attribute color
     * @type Color
     * @optional
     */
    color?: Color

    /**
     * @attribute depth
     * @type number
     * @optional
     * @default 1
     */
    depth?: number;

    /**
     * @attribute height
     * @type number
     * @optional
     * @default 1
     */
    height?: number;

    /**
     * @attribute offset
     * @type VectorE3
     * @optional
     * @default 0
     */
    offset?: VectorE3;

    /**
     * @attribute position
     * @type VectorE3
     * @optional
     * @default 0
     */
    position?: VectorE3;

    /**
     * @attribute width
     * @type number
     * @optional
     * @default 1
     */
    width?: number;
}

export default BoxOptions
