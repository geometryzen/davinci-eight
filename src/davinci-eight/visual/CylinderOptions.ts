import VisualOptions from './VisualOptions'
import VectorE3 from '../math/VectorE3'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class CylinderOptions
 * @extends VisualOptions
 */
interface CylinderOptions extends VisualOptions {

    /**
     * @attribute axis
     * @type VectorE3
     * @optional
     * @default e2
     */
    axis?: VectorE3

    /**
     * @attribute length
     * @type number
     * @optional
     * @default 1
     */
    length?: number

    /**
     * @attribute openBase
     * @type boolean
     * @optional
     * @default false
     */
    openBase?: boolean

    /**
     * @attribute openCap
     * @type boolean
     * @optional
     * @default false
     */
    openCap?: boolean

    /**
     * @attribute openWall
     * @type boolean
     * @optional
     * @default false
     */
    openWall?: boolean


    /**
     * @attribute radius
     * @type number
     * @optional
     * @default 1
     */
    radius?: number
}

export default CylinderOptions
