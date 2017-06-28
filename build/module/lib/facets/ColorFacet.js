import { Color } from '../core/Color';
import { mustBeNumber } from '../checks/mustBeNumber';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
/**
 *
 */
var ColorFacet = (function () {
    /**
     *
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
        enumerable: true,
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
        enumerable: true,
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
        enumerable: true,
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
        var name = this.uColorName;
        if (name) {
            var color = this.color;
            visitor.uniform3f(name, color.r, color.g, color.b);
        }
    };
    /**
     *
     */
    ColorFacet.PROP_RGB = 'rgb';
    /**
     *
     */
    ColorFacet.PROP_RED = 'r';
    /**
     *
     */
    ColorFacet.PROP_GREEN = 'g';
    /**
     *
     */
    ColorFacet.PROP_BLUE = 'b';
    return ColorFacet;
}());
export { ColorFacet };
