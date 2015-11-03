var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/clamp', '../checks/mustBeArray', '../checks/mustBeNumber', '../core/principalAngle', '../math/VectorN'], function (require, exports, clamp, mustBeArray, mustBeNumber, principalAngle, VectorN) {
    var pow = Math.pow;
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    /**
     * <p>
     * A mutable type representing a color through its RGB components.
     * </p>
     * <p>
     * WARNING: In many object-oriented designs, types representing values are completely immutable.
     * In a graphics library where data changes rapidly and garbage collection might become an issue,
     * it is common to use reference types, such as in this design. This mutability can lead to
     * difficult bugs because it is hard to reason about where a color may have changed.
     * </p>
     *
     * @class Color
     * @extends VectorN
     * @implements ColorRGB
     */
    var Color = (function (_super) {
        __extends(Color, _super);
        /**
         * @class Color
         * @constructor
         * @param data {number[]}
         * @param areYouSure {boolean}
         */
        function Color(r, g, b) {
            _super.call(this, [r, g, b], false, 3);
        }
        Object.defineProperty(Color.prototype, "r", {
            /**
             * @property r
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_R];
            },
            set: function (r) {
                this.coords[COORD_R] = clamp(r, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            /**
             * @property g
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_G];
            },
            set: function (g) {
                this.coords[COORD_G] = clamp(g, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            /**
             * @property b
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_B];
            },
            set: function (b) {
                this.coords[COORD_B] = clamp(b, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method clone
         * @return {Color}
         * @chainable
         */
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b);
        };
        /**
         * @method copy
         * @param color {ColorRGB}
         * @return {Color}
         * @chainable
         */
        Color.prototype.copy = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            return this;
        };
        /**
         * @method interpolate
         * @param target {ColorRGB}
         * @param α {number}
         * @return {Color}
         * @chainable
         */
        Color.prototype.interpolate = function (target, α) {
            this.r += (target.r - this.r) * α;
            this.g += (target.g - this.g) * α;
            this.b += (target.b - this.b) * α;
            return this;
        };
        Object.defineProperty(Color.prototype, "luminance", {
            /**
             * @property luminance
             * @type {number}
             * @readOnly
             */
            get: function () {
                return Color.luminance(this.r, this.g, this.b);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method toString
         * @return {string}
         */
        Color.prototype.toString = function () {
            // FIXME: Use vector stuff
            return "Color(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        /**
         * @method luminance
         * @param r {number}
         * @param g {number}
         * @param b {number}
         * @return {number}
         * @static
         */
        Color.luminance = function (r, g, b) {
            mustBeNumber('r', r);
            mustBeNumber('g', g);
            mustBeNumber('b', b);
            var γ = 2.2;
            return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
        };
        /**
         * @method fromColor
         * @param color {ColorRGB}
         * @return {Color}
         * @static
         * @chainable
         */
        Color.fromColor = function (color) {
            return new Color(color.r, color.g, color.b);
        };
        /**
         * @method fromCoords
         * @param coords {number[]}
         * @return {Color}
         * @chainable
         */
        Color.fromCoords = function (coords) {
            mustBeArray('coords', coords);
            var r = mustBeNumber('r', coords[COORD_R]);
            var g = mustBeNumber('g', coords[COORD_G]);
            var b = mustBeNumber('b', coords[COORD_B]);
            return new Color(r, g, b);
        };
        /**
         * Converts an angle, radius, height to a color on a color wheel.
         * @method fromHSL
         * @param H {number}
         * @param S {number}
         * @param L {number}
         * @return {Color}
         * @static
         * @chainable
         */
        Color.fromHSL = function (H, S, L) {
            mustBeNumber('H', H);
            mustBeNumber('S', S);
            mustBeNumber('L', L);
            var C = (1 - Math.abs(2 * L - 1)) * S;
            /**
             * This function captures C and L
             */
            function matchLightness(R, G, B) {
                var x = Color.luminance(R, G, B);
                var m = L - 0.5 * C;
                return new Color(R + m, G + m, B + m);
            }
            var sextant = ((principalAngle(H) / Math.PI) * 3) % 6;
            var X = C * (1 - Math.abs(sextant % 2 - 1));
            if (sextant >= 0 && sextant < 1) {
                return matchLightness(C, X /*C*(sextant-0)*/, 0);
            }
            else if (sextant >= 1 && sextant < 2) {
                return matchLightness(X /*C*(2-sextant)*/, C, 0);
            }
            else if (sextant >= 2 && sextant < 3) {
                return matchLightness(0, C, C * (sextant - 2));
            }
            else if (sextant >= 3 && sextant < 4) {
                return matchLightness(0, C * (4 - sextant), C);
            }
            else if (sextant >= 4 && sextant < 5) {
                return matchLightness(X, 0, C);
            }
            else if (sextant >= 5 && sextant < 6) {
                return matchLightness(C, 0, X);
            }
            else {
                return matchLightness(0, 0, 0);
            }
        };
        /**
         * @method fromRGB
         * @param r {number}
         * @param g {number}
         * @param b {number}
         * @return {Color}
         * @static
         * @chainable
         */
        Color.fromRGB = function (r, g, b) {
            mustBeNumber('r', r);
            mustBeNumber('g', g);
            mustBeNumber('b', b);
            return new Color(r, g, b);
        };
        /**
         * @method interpolate
         * @param a {ColorRGB}
         * @param b {ColorRGB}
         * @param α {number}
         * @return {Color}
         * @static
         * @chainable
         */
        Color.interpolate = function (a, b, α) {
            return Color.fromColor(a).interpolate(b, α);
        };
        /**
         * @property black
         * @type {Color}
         * @static
         */
        Color.black = new Color(0, 0, 0);
        /**
         * @property blue
         * @type {Color}
         * @static
         */
        Color.blue = new Color(0, 0, 1);
        /**
         * @property green
         * @type {Color}
         * @static
         */
        Color.green = new Color(0, 1, 0);
        /**
         * @property cyan
         * @type {Color}
         * @static
         */
        Color.cyan = new Color(0, 1, 1);
        /**
         * @property red
         * @type {Color}
         * @static
         */
        Color.red = new Color(1, 0, 0);
        /**
         * @property magenta
         * @type {Color}
         * @static
         */
        Color.magenta = new Color(1, 0, 1);
        /**
         * @property yellow
         * @type {Color}
         * @static
         */
        Color.yellow = new Color(1, 1, 0);
        /**
         * @property white
         * @type {Color}
         * @static
         */
        Color.white = new Color(1, 1, 1);
        return Color;
    })(VectorN);
    return Color;
});
