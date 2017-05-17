"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = require("../core/Color");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
/**
 *
 */
var ColorFacet = (function () {
    /**
     *
     */
    function ColorFacet(uColorName) {
        if (uColorName === void 0) { uColorName = GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR; }
        this.uColorName = uColorName;
        /**
         *
         */
        this.color = Color_1.Color.fromRGB(1, 1, 1);
    }
    Object.defineProperty(ColorFacet.prototype, "r", {
        /**
         * The red component of the color.
         */
        get: function () {
            return this.color.r;
        },
        set: function (r) {
            mustBeNumber_1.mustBeNumber('r', r);
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
            mustBeNumber_1.mustBeNumber('g', g);
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
            mustBeNumber_1.mustBeNumber('b', b);
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
    return ColorFacet;
}());
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
exports.ColorFacet = ColorFacet;
