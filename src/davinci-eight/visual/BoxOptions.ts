import VisualOptions from './VisualOptions'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class BoxOptions
 * @extends VisualOptions
 */
interface BoxOptions extends VisualOptions {

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
     * @attribute openBack
     * @type boolean
     * @optional
     * @default false
     */
    openBack?: boolean;

    /**
     * @attribute openBase
     * @type boolean
     * @optional
     * @default false
     */
    openBase?: boolean;

    /**
     * @attribute openFront
     * @type boolean
     * @optional
     * @default false
     */
    openFront?: boolean;

    /**
     * @attribute openLeft
     * @type boolean
     * @optional
     * @default false
     */
    openLeft?: boolean;

    /**
     * @attribute openRight
     * @type boolean
     * @optional
     * @default false
     */
    openRight?: boolean;

    /**
     * @attribute openCap
     * @type boolean
     * @optional
     * @default false
     */
    openCap?: boolean;

    /**
     * @attribute width
     * @type number
     * @optional
     * @default 1
     */
    width?: number;
}

export default BoxOptions
