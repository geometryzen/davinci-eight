var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/clamp', '../checks/mustBeArray', '../checks/mustBeNumber', '../core/principalAngle', '../math/VectorN'], function (require, exports, clamp_1, mustBeArray_1, mustBeNumber_1, principalAngle_1, VectorN_1) {
    var pow = Math.pow;
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    var Color = (function (_super) {
        __extends(Color, _super);
        function Color(r, g, b) {
            _super.call(this, [r, g, b], false, 3);
        }
        Object.defineProperty(Color.prototype, "r", {
            get: function () {
                return this.coords[COORD_R];
            },
            set: function (r) {
                this.coords[COORD_R] = clamp_1.default(r, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            get: function () {
                return this.coords[COORD_G];
            },
            set: function (g) {
                this.coords[COORD_G] = clamp_1.default(g, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            get: function () {
                return this.coords[COORD_B];
            },
            set: function (b) {
                this.coords[COORD_B] = clamp_1.default(b, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b);
        };
        Color.prototype.copy = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            return this;
        };
        Color.prototype.interpolate = function (target, α) {
            this.r += (target.r - this.r) * α;
            this.g += (target.g - this.g) * α;
            this.b += (target.b - this.b) * α;
            return this;
        };
        Object.defineProperty(Color.prototype, "luminance", {
            get: function () {
                return Color.luminance(this.r, this.g, this.b);
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.toString = function () {
            return "Color(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        Color.luminance = function (r, g, b) {
            mustBeNumber_1.default('r', r);
            mustBeNumber_1.default('g', g);
            mustBeNumber_1.default('b', b);
            var γ = 2.2;
            return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
        };
        Color.fromColor = function (color) {
            return new Color(color.r, color.g, color.b);
        };
        Color.fromCoords = function (coords) {
            mustBeArray_1.default('coords', coords);
            var r = mustBeNumber_1.default('r', coords[COORD_R]);
            var g = mustBeNumber_1.default('g', coords[COORD_G]);
            var b = mustBeNumber_1.default('b', coords[COORD_B]);
            return new Color(r, g, b);
        };
        Color.fromHSL = function (H, S, L) {
            mustBeNumber_1.default('H', H);
            mustBeNumber_1.default('S', S);
            mustBeNumber_1.default('L', L);
            var C = (1 - Math.abs(2 * L - 1)) * S;
            function matchLightness(R, G, B) {
                var m = L - 0.5 * C;
                return new Color(R + m, G + m, B + m);
            }
            var sextant = ((principalAngle_1.default(H) / Math.PI) * 3) % 6;
            var X = C * (1 - Math.abs(sextant % 2 - 1));
            if (sextant >= 0 && sextant < 1) {
                return matchLightness(C, X, 0);
            }
            else if (sextant >= 1 && sextant < 2) {
                return matchLightness(X, C, 0);
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
        Color.fromRGB = function (r, g, b) {
            mustBeNumber_1.default('r', r);
            mustBeNumber_1.default('g', g);
            mustBeNumber_1.default('b', b);
            return new Color(r, g, b);
        };
        Color.interpolate = function (a, b, α) {
            return Color.fromColor(a).interpolate(b, α);
        };
        Color.black = new Color(0, 0, 0);
        Color.blue = new Color(0, 0, 1);
        Color.green = new Color(0, 1, 0);
        Color.cyan = new Color(0, 1, 1);
        Color.red = new Color(1, 0, 0);
        Color.magenta = new Color(1, 0, 1);
        Color.yellow = new Color(1, 1, 0);
        Color.white = new Color(1, 1, 1);
        return Color;
    })(VectorN_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Color;
});
