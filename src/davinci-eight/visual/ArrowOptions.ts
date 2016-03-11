import VectorE3 from '../math/VectorE3'
import VisualOptions from './VisualOptions'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class ArrowOptions
 * @extends VisualOptions
 */
interface ArrowOptions extends VisualOptions {

    /**
     * @attribute vector
     * @type VectorE3
     * @optional
     * @default e2
     */
    vector?: VectorE3
}

export default ArrowOptions
