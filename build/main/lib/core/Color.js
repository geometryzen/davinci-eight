"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var clamp_1 = require("../math/clamp");
var Coords_1 = require("../math/Coords");
var isDefined_1 = require("../checks/isDefined");
var Lockable_1 = require("../core/Lockable");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeLE_1 = require("../checks/mustBeLE");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var principalAngle_1 = require("./principalAngle");
var COORD_R = 0;
var COORD_G = 1;
var COORD_B = 2;
var rgb255 = function rgb255(red, green, blue) {
    var UBYTEMAX = 255;
    return new Color(red / UBYTEMAX, green / UBYTEMAX, blue / UBYTEMAX);
};
/**
 * A mutable type representing a color through its RGB components.
 */
var Color = (function (_super) {
    tslib_1.__extends(Color, _super);
    function Color(r, g, b) {
        var _this = _super.call(this, [r, g, b], false, 3) || this;
        mustBeGE_1.mustBeGE('r', r, 0);
        mustBeLE_1.mustBeLE('r', r, 1);
        mustBeGE_1.mustBeGE('g', g, 0);
        mustBeLE_1.mustBeLE('g', g, 1);
        mustBeGE_1.mustBeGE('b', b, 0);
        mustBeLE_1.mustBeLE('b', b, 1);
        return _this;
    }
    Object.defineProperty(Color.prototype, "r", {
        /**
         * The red coordinate (component) of this color.
         */
        get: function () {
            return this.coords[COORD_R];
        },
        set: function (r) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set r');
            }
            this.coords[COORD_R] = clamp_1.clamp(r, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "red", {
        get: function () {
            return this.coords[COORD_R];
        },
        set: function (red) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set red');
            }
            this.coords[COORD_R] = clamp_1.clamp(red, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "g", {
        /**
         * The green coordinate (component) of this color.
         */
        get: function () {
            return this.coords[COORD_G];
        },
        set: function (g) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set g');
            }
            this.coords[COORD_G] = clamp_1.clamp(g, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "green", {
        get: function () {
            return this.coords[COORD_G];
        },
        set: function (green) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set green');
            }
            this.coords[COORD_G] = clamp_1.clamp(green, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "b", {
        /**
         * The blue coordinate (component) of this color.
         */
        get: function () {
            return this.coords[COORD_B];
        },
        set: function (b) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set b');
            }
            this.coords[COORD_B] = clamp_1.clamp(b, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "blue", {
        get: function () {
            return this.coords[COORD_B];
        },
        set: function (blue) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set blue');
            }
            this.coords[COORD_B] = clamp_1.clamp(blue, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a color in which any rgb component whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate is zero.
     * @param n The exponent used to determine which components are set to zero.
     * @returns approx(this)
     */
    Color.prototype.approx = function (n) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().approx(n));
        }
        else {
            _super.prototype.approx.call(this, n);
            return this;
        }
    };
    /**
     * @returns a mutable instance of this color.
     */
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b);
    };
    /**
     * Copies the specified color into this Color instance.
     * @param color The color to be copied.
     * @returns
     */
    Color.prototype.copy = function (color) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('copy');
        }
        if (isDefined_1.isDefined(color)) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
        }
        else {
            // We can choose what to do based upon a global setting?
            this.r = Math.random();
            this.g = Math.random();
            this.b = Math.random();
        }
        return this;
    };
    /**
     * Linearly interpolates from this color to the specified color.
     * @param target The color returned when α = 1.
     * @param α The parameter that determines the composition of the color.
     * @returns this + (target - this) * α
     */
    Color.prototype.lerp = function (target, α) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().lerp(target, α));
        }
        else {
            this.r += (target.r - this.r) * α;
            this.g += (target.g - this.g) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    };
    Object.defineProperty(Color.prototype, "luminance", {
        /**
         * Computes the luminance of this color.
         */
        get: function () {
            return Color.luminance(this.r, this.g, this.b);
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Color.prototype.scale = function (α) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().scale(α));
        }
        else {
            this.r = this.r * α;
            this.g = this.g * α;
            this.b = this.b * α;
            return this;
        }
    };
    Color.prototype.toExponential = function (fractionDigits) {
        return this.toString();
    };
    Color.prototype.toFixed = function (fractionDigits) {
        return this.toString();
    };
    Color.prototype.toPrecision = function (precision) {
        return this.toString();
    };
    /**
     * @returns A string representation of this color.
     */
    Color.prototype.toString = function (radix) {
        return "Color(" + this.r.toString(radix) + ", " + this.g.toString(radix) + ", " + this.b.toString(radix) + ")";
    };
    /**
     * @param color The color to be copied.
     * @returns A mutable copy of the specified color.
     */
    Color.copy = function (color) {
        return new Color(color.r, color.g, color.b);
    };
    /**
     * @param r
     * @param g
     * @param b
     * @returns
     */
    Color.luminance = function (r, g, b) {
        mustBeNumber_1.mustBeNumber('r', r);
        mustBeNumber_1.mustBeNumber('g', g);
        mustBeNumber_1.mustBeNumber('b', b);
        var pow = Math.pow;
        var γ = 2.2;
        return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
    };
    /**
     * @param coords
     * @returns
     */
    /*
    public static fromCoords(coords: number[]): Color {
        mustBeArray('coords', coords);
        const r = mustBeNumber('r', coords[COORD_R]);
        const g = mustBeNumber('g', coords[COORD_G]);
        const b = mustBeNumber('b', coords[COORD_B]);
        return new Color(r, g, b);
    }
    */
    /**
     * Converts an angle, radius, height to a color on a color wheel.
     *
     * @param H
     * @param S
     * @param L
     * @returns
     */
    Color.fromHSL = function (H, S, L) {
        mustBeNumber_1.mustBeNumber('H', H);
        mustBeNumber_1.mustBeNumber('S', S);
        mustBeNumber_1.mustBeNumber('L', L);
        var C = (1 - Math.abs(2 * L - 1)) * S;
        /**
         * This function captures C and L
         */
        function matchLightness(R, G, B) {
            // var x = Color.luminance(R, G, B)
            var m = L - 0.5 * C;
            return new Color(R + m, G + m, B + m);
        }
        var sextant = ((principalAngle_1.principalAngle(H) / Math.PI) * 3) % 6;
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
     * Constructs a new mutable instance of Color from the rgb components.
     * The components are clamped to the range [0, 1].
     *
     * @param r The red component.
     * @param g The green component.
     * @param b The blue component.
     */
    Color.fromRGB = function (r, g, b) {
        mustBeNumber_1.mustBeNumber('r', r);
        mustBeNumber_1.mustBeNumber('g', g);
        mustBeNumber_1.mustBeNumber('b', b);
        return new Color(clamp_1.clamp(r, 0, 1), clamp_1.clamp(g, 0, 1), clamp_1.clamp(b, 0, 1));
    };
    Color.isInstance = function (x) {
        return x instanceof Color;
    };
    /**
     * @param a
     * @param b
     * @param α
     * @returns
     */
    Color.lerp = function (a, b, α) {
        return Color.copy(a).lerp(b, clamp_1.clamp(α, 0, 1));
    };
    Color.mustBe = function (name, color) {
        if (Color.isInstance(color)) {
            return color;
        }
        else {
            throw new Error(name + " must be a Color.");
        }
    };
    /**
     * Creates a color in which the red, green, and blue properties lie in the range [0, 1].
     */
    Color.random = function () {
        return Color.fromRGB(Math.random(), Math.random(), Math.random());
    };
    return Color;
}(Coords_1.Coords));
exports.Color = Color;
/**
 *
 */
Color.black = Lockable_1.lock(new Color(0, 0, 0));
/**
 *
 */
Color.blue = Lockable_1.lock(new Color(0, 0, 1));
/**
 *
 */
Color.green = Lockable_1.lock(new Color(0, 1, 0));
/**
 *
 */
Color.cyan = Lockable_1.lock(new Color(0, 1, 1));
/**
 *
 */
Color.red = Lockable_1.lock(new Color(1, 0, 0));
/**
 *
 */
Color.magenta = Lockable_1.lock(new Color(1, 0, 1));
/**
 *
 */
Color.yellow = Lockable_1.lock(new Color(1, 1, 0));
/**
 *
 */
Color.white = Lockable_1.lock(new Color(1, 1, 1));
/**
 *
 */
Color.gray = Lockable_1.lock(new Color(0.5, 0.5, 0.5));
/**
 *
 */
Color.blueviolet = Lockable_1.lock(rgb255(138, 43, 226));
/**
 *
 */
Color.chartreuse = Lockable_1.lock(rgb255(127, 255, 0));
/**
 *
 */
Color.cobalt = Lockable_1.lock(rgb255(61, 89, 171));
/**
 *
 */
Color.hotpink = Lockable_1.lock(rgb255(255, 105, 180));
/**
 *
 */
Color.lime = Lockable_1.lock(rgb255(0, 255, 0));
/**
 *
 */
Color.slateblue = Lockable_1.lock(rgb255(113, 113, 198));
/**
 *
 */
Color.springgreen = Lockable_1.lock(rgb255(0, 255, 127));
/**
 *
 */
Color.teal = Lockable_1.lock(rgb255(56, 142, 142));
