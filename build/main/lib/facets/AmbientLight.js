"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = require("../core/Color");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var mustBeObject_1 = require("../checks/mustBeObject");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
/**
 *
 */
var AmbientLight = /** @class */ (function () {
    /**
     *
     */
    function AmbientLight(color) {
        mustBeObject_1.mustBeObject('color', color);
        // FIXME: Need some kind of locking for constants
        this.color = Color_1.Color.white.clone();
        this.color.r = mustBeNumber_1.mustBeNumber('color.r', color.r);
        this.color.g = mustBeNumber_1.mustBeNumber('color.g', color.g);
        this.color.b = mustBeNumber_1.mustBeNumber('color.b', color.b);
    }
    /**
     *
     */
    AmbientLight.prototype.setUniforms = function (visitor) {
        var color = this.color;
        visitor.uniform3f(GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, color.r, color.g, color.b);
    };
    return AmbientLight;
}());
exports.AmbientLight = AmbientLight;
