import Color from '../core/Color'
import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class CommonOptions
 */
interface CommonOptions {

    /**
     * @attribute tilt
     * @type SpinorE3
     * @optional
     * @default 1
     */
    attitude?: SpinorE3;

    /**
     * @attribute color
     * @type Color
     * @optional
     */
    color?: Color

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
     * @attribute tilt
     * @type SpinorE3
     * @optional
     * @default 1
     */
    tilt?: SpinorE3;
}

export default CommonOptions
