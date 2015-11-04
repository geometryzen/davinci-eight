var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../utils/Shareable', '../core/Symbolic'], function (require, exports, mustBeNumber, Shareable, Symbolic) {
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    /**
     * @class ColorFacet
     */
    var ColorFacet = (function (_super) {
        __extends(ColorFacet, _super);
        /**
         * @class ColorFacet
         * @constructor
         */
        function ColorFacet() {
            _super.call(this, 'ColorFacet');
            /**
             * @property xyz
             * @type {number[]}
             * @private
             */
            this.xyz = [1, 1, 1];
            /**
             * @property a
             * @type {number}
             * @private
             */
            this.a = 1;
            this.uColorName = Symbolic.UNIFORM_COLOR;
            this.uAlphaName = Symbolic.UNIFORM_ALPHA;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ColorFacet.prototype.destructor = function () {
            this.xyz = void 0;
            _super.prototype.destructor.call(this);
        };
        ColorFacet.prototype.incRef = function () {
            this.addRef();
            return this;
        };
        ColorFacet.prototype.decRef = function () {
            this.release();
            return this;
        };
        Object.defineProperty(ColorFacet.prototype, "r", {
            /**
             * The red component of the color.
             * @property r
             * @type {number}
             */
            get: function () {
                return this.xyz[COORD_R];
            },
            set: function (red) {
                mustBeNumber('red', red);
                this.xyz[COORD_R] = red;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "g", {
            /**
             * The green component of the color.
             * @property g
             * @type {number}
             */
            get: function () {
                return this.xyz[COORD_G];
            },
            set: function (green) {
                mustBeNumber('green', green);
                this.xyz[COORD_G] = green;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "b", {
            /**
             * The blue component of the color.
             * @property b
             * @type {number}
             */
            get: function () {
                return this.xyz[COORD_B];
            },
            set: function (blue) {
                this.xyz[COORD_B] = blue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "α", {
            /**
             * The alpha component of the color.
             * @property α
             * @type {number}
             */
            get: function () {
                return this.a;
            },
            set: function (α) {
                this.a = α;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method scaleRGB
         * @param α {number}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.scaleRGB = function (α) {
            this.r *= α;
            this.g *= α;
            this.b *= α;
            return this;
        };
        /**
         * @method scaleRGBA
         * @param α {number}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.scaleRGBA = function (α) {
            this.r *= α;
            this.g *= α;
            this.b *= α;
            this.α *= α;
            return this;
        };
        /**
         * @method setColorRGB
         * @param color {ColorRGB}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.setColorRGB = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            return this;
        };
        /**
         * @method setColorRGBA
         * @param color {ColorRGBA}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.setColorRGBA = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            this.α = color.α;
            return this;
        };
        /**
         * @method setRGB
         * @param red {number}
         * @param green {number}
         * @param blue {number}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.setRGB = function (red, green, blue) {
            this.r = red;
            this.g = green;
            this.b = blue;
            return this;
        };
        /**
         * @method setRGBA
         * @param red {number}
         * @param green {number}
         * @param blue {number}
         * @param α {number}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.setRGBA = function (red, green, blue, α) {
            this.r = red;
            this.g = green;
            this.b = blue;
            this.α = α;
            return this;
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
        ColorFacet.prototype.getProperty = function (name) {
            switch (name) {
                case ColorFacet.PROP_RGB: {
                    return [this.r, this.g, this.b];
                }
                case ColorFacet.PROP_RED: {
                    return [this.r];
                }
                case ColorFacet.PROP_GREEN: {
                    return [this.g];
                }
                default: {
                    console.warn("ColorFacet.getProperty " + name);
                    return void 0;
                }
            }
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param data {number[]}
         * @return {void}
         */
        ColorFacet.prototype.setProperty = function (name, data) {
            switch (name) {
                case ColorFacet.PROP_RGB: {
                    this.r = data[COORD_R];
                    this.g = data[COORD_G];
                    this.b = data[COORD_B];
                    break;
                }
                case ColorFacet.PROP_RED: {
                    this.r = data[COORD_R];
                    break;
                }
                default: {
                    console.warn("ColorFacet.setProperty " + name);
                }
            }
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        ColorFacet.prototype.setUniforms = function (visitor, canvasId) {
            if (this.uColorName) {
                visitor.vector3(this.uColorName, this.xyz, canvasId);
            }
            if (this.uAlphaName) {
                visitor.uniform1f(this.uAlphaName, this.a, canvasId);
            }
        };
        /**
         * property PROP_RGB
         * @type {string}
         * @static
         */
        ColorFacet.PROP_RGB = 'rgb';
        /**
         * property PROP_RGBA
         * @type {string}
         * @static
         */
        ColorFacet.PROP_RGBA = 'rgba';
        /**
         * property PROP_RED
         * @type {string}
         * @static
         */
        ColorFacet.PROP_RED = 'red';
        /**
         * property PROP_GREEN
         * @type {string}
         * @static
         */
        ColorFacet.PROP_GREEN = 'green';
        /**
         * property PROP_BLUE
         * @type {string}
         * @static
         */
        ColorFacet.PROP_BLUE = 'blue';
        /**
         * property PROP_ALPHA
         * @type {string}
         * @static
         */
        ColorFacet.PROP_ALPHA = 'alpha';
        return ColorFacet;
    })(Shareable);
    return ColorFacet;
});
