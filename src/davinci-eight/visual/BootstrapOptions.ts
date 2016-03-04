/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class BootstrapOptions
 */
interface BootstrapOptions {
    /**
     * @attribute height
     * @type number
     * @optional
     */
    height?: number;
    memcheck?: boolean;
    onload?: () => any;
    onunload?: () => any;

    /**
     *
     */
    width?: number;
}

export default BootstrapOptions
