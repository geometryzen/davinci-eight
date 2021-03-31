import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
/**
 * Sets the 'uColor' uniform to the color RGB value.
 */
var ColorFacet = /** @class */ (function () {
    /**
     * @param uColorName The name of the WebL uniform that this facet will affect.
     */
    function ColorFacet(uColorName) {
        if (uColorName === void 0) { uColorName = GraphicsProgramSymbols.UNIFORM_COLOR; }
        this.uColorName = uColorName;
        /**
         *
         */
        this.color = Color.fromRGB(1, 1, 1);
    }
    Object.defineProperty(ColorFacet.prototype, "r", {
        /**
         * The red component of the color.
         */
        get: function () {
            return this.color.r;
        },
        set: function (r) {
            mustBeNumber('r', r);
            this.color.r = r;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorFacet.prototype, "g", {
        /**
         * The green component of the color.
         */
        get: function () {
            return this.color.g;
        },
        set: function (g) {
            mustBeNumber('g', g);
            this.color.g = g;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorFacet.prototype, "b", {
        /**
         * The blue component of the color.
         */
        get: function () {
            return this.color.b;
        },
        set: function (b) {
            mustBeNumber('b', b);
            this.color.b = b;
        },
        enumerable: false,
        configurable: true
    });
    ColorFacet.prototype.scaleRGB = function (α) {
        this.r *= α;
        this.g *= α;
        this.b *= α;
        return this;
    };
    ColorFacet.prototype.setRGB = function (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    };
    /**
     *
     */
    ColorFacet.prototype.setUniforms = function (visitor) {
        var uColorName = this.uColorName;
        if (uColorName) {
            var color = this.color;
            visitor.uniform3f(uColorName, color.r, color.g, color.b);
        }
    };
    /**
     * @hidden
     */
    ColorFacet.PROP_RGB = 'rgb';
    /**
     * @hidden
     */
    ColorFacet.PROP_RED = 'r';
    /**
     * @hidden
     */
    ColorFacet.PROP_GREEN = 'g';
    /**
     * @hidden
     */
    ColorFacet.PROP_BLUE = 'b';
    return ColorFacet;
}());
export { ColorFacet };
