define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
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
        Object.defineProperty(Color.prototype, "r", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.clone = function () {
            return new Color([this.data[0], this.data[1], this.data[2]]);
        };
        Color.prototype.luminance = function () {
            return Color.luminance(this.r, this.g, this.b);
        };
        Color.prototype.toString = function () {
            return "Color(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        Color.luminance = function (r, g, b) {
            var gamma = 2.2;
            return 0.2126 * Math.pow(r, gamma) + 0.7152 * Math.pow(g, gamma) + 0.0722 * Math.pow(b, gamma);
        };
        /**
         * Converts an angle, radius, height to a color on a color wheel.
         */
        Color.fromHSL = function (H, S, L) {
            var C = (1 - Math.abs(2 * L - 1)) * S;
            function normalizeAngle(angle) {
                if (angle > 2 * Math.PI) {
                    return normalizeAngle(angle - 2 * Math.PI);
                }
                else if (angle < 0) {
                    return normalizeAngle(angle + 2 * Math.PI);
                }
                else {
                    return angle;
                }
            }
            function matchLightness(R, G, B) {
                var x = Color.luminance(R, G, B);
                var m = L - (0.5 * C);
                return new Color([R + m, G + m, B + m]);
            }
            var sextant = ((normalizeAngle(H) / Math.PI) * 3) % 6;
            var X = C * (1 - Math.abs(sextant % 2 - 1));
            if (sextant >= 0 && sextant < 1) {
                return matchLightness(C, X /*C*(sextant-0)*/, 0.0);
            }
            else if (sextant >= 1 && sextant < 2) {
                return matchLightness(X /*C*(2-sextant)*/, C, 0.0);
            }
            else if (sextant >= 2 && sextant < 3) {
                return matchLightness(0.0, C, C * (sextant - 2));
            }
            else if (sextant >= 3 && sextant < 4) {
                return matchLightness(0.0, C * (4 - sextant), C);
            }
            else if (sextant >= 4 && sextant < 5) {
                return matchLightness(X, 0.0, C);
            }
            else if (sextant >= 5 && sextant < 6) {
                return matchLightness(C, 0.0, X);
            }
            else {
                return matchLightness(0.0, 0.0, 0.0);
            }
        };
        Color.fromRGB = function (red, green, blue) {
            expectArg('red', red).toBeNumber().toBeInClosedInterval(0, 1);
            expectArg('green', green).toBeNumber().toBeInClosedInterval(0, 1);
            expectArg('blue', blue).toBeNumber().toBeInClosedInterval(0, 1);
            return new Color([red, green, blue]);
        };
        Color.copy = function (color) {
            return new Color([color.r, color.g, color.b]);
        };
        return Color;
    })();
    return Color;
});
