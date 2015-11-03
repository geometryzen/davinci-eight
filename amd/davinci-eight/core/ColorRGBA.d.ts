import ColorRGB = require('../core/ColorRGB');
/**
 * @class ColorRGBA
 * @extends ColorRGB
 */
interface ColorRGBA extends ColorRGB {
    /**
     * The <em>alpha</em> component of the color.
     * @property α
     * @type {number}
     */
    α: number;
}
export = ColorRGBA;
