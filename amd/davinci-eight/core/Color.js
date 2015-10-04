define(["require", "exports", '../math/clamp', '../checks/expectArg', '../checks/mustBeNumber', '../core/principalAngle'], function (require, exports, clamp, expectArg, mustBeNumber, principalAngle) {
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
     * @implements ColorRGB
     * @implements Mutable<number[]>
     */
    var Color = (function () {
        /**
         * @class Color
         * @constructor
         * @param data {number[]}
         */
        function Color(data) {
            if (data === void 0) { data = [0, 0, 0]; }
            this.modified = false;
            expectArg('data', data).toSatisfy(data.length === 3, "data must have length equal to 3");
            this.data = data;
        }
        Object.defineProperty(Color.prototype, "red", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = clamp(value, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "green", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = clamp(value, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "blue", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = clamp(value, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.clone = function () {
            return new Color([this.data[0], this.data[1], this.data[2]]);
        };
        Color.prototype.interpolate = function (target, alpha) {
            this.red += (target.red - this.red) * alpha;
            this.green += (target.green - this.green) * alpha;
            this.blue += (target.blue - this.blue) * alpha;
            return this;
        };
        Object.defineProperty(Color.prototype, "luminance", {
            get: function () {
                return Color.luminance(this.red, this.green, this.blue);
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.toString = function () {
            return "Color(" + this.red + ", " + this.green + ", " + this.blue + ")";
        };
        Color.luminance = function (red, green, blue) {
            mustBeNumber('red', red);
            mustBeNumber('green', green);
            mustBeNumber('blue', blue);
            var gamma = 2.2;
            return 0.2126 * Math.pow(red, gamma) + 0.7152 * Math.pow(green, gamma) + 0.0722 * Math.pow(blue, gamma);
        };
        /**
         * Converts an angle, radius, height to a color on a color wheel.
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
                return new Color([R + m, G + m, B + m]);
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
        Color.fromRGB = function (red, green, blue) {
            mustBeNumber('red', red);
            mustBeNumber('green', green);
            mustBeNumber('blue', blue);
            // FIXME: Replace with functions that don't create temporaries.
            expectArg('red', red).toBeNumber().toBeInClosedInterval(0, 1);
            expectArg('green', green).toBeNumber().toBeInClosedInterval(0, 1);
            expectArg('blue', blue).toBeNumber().toBeInClosedInterval(0, 1);
            return new Color([red, green, blue]);
        };
        Color.copy = function (color) {
            return new Color([color.red, color.green, color.blue]);
        };
        Color.interpolate = function (a, b, alpha) {
            return Color.copy(a).interpolate(b, alpha);
        };
        /**
         * @property black
         * @type {Color}
         * @static
         */
        Color.black = new Color([0, 0, 0]);
        /**
         * @property blue
         * @type {Color}
         * @static
         */
        Color.blue = new Color([0, 0, 1]);
        /**
         * @property green
         * @type {Color}
         * @static
         */
        Color.green = new Color([0, 1, 0]);
        /**
         * @property cyan
         * @type {Color}
         * @static
         */
        Color.cyan = new Color([0, 1, 1]);
        /**
         * @property red
         * @type {Color}
         * @static
         */
        Color.red = new Color([1, 0, 0]);
        /**
         * @property magenta
         * @type {Color}
         * @static
         */
        Color.magenta = new Color([1, 0, 1]);
        /**
         * @property yellow
         * @type {Color}
         * @static
         */
        Color.yellow = new Color([1, 1, 0]);
        /**
         * @property white
         * @type {Color}
         * @static
         */
        Color.white = new Color([1, 1, 1]);
        return Color;
    })();
    return Color;
});
