import AbstractColor from '../core/AbstractColor'
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
     * @attribute axis
     * @type VectorE3
     * @optional
     * @default e2
     */
    axis?: VectorE3

    /**
     * @attribute color
     * @type AbstractColor
     * @optional
     */
    color?: AbstractColor

    /**
     * @attribute position
     * @type VectorE3
     * @optional
     * @default 0
     */
    position?: VectorE3
}

export default ArrowOptions
