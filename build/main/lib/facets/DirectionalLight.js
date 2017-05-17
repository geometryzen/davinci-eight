"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = require("../core/Color");
var Geometric3_1 = require("../math/Geometric3");
var mustBeObject_1 = require("../checks/mustBeObject");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Vector3_1 = require("../math/Vector3");
/**
 *
 */
var DirectionalLight = (function () {
    function DirectionalLight(direction, color) {
        if (direction === void 0) { direction = Vector3_1.Vector3.vector(0, 0, 1).neg(); }
        if (color === void 0) { color = Color_1.Color.white; }
        mustBeObject_1.mustBeObject('direction', direction);
        mustBeObject_1.mustBeObject('color', color);
        this.direction_ = Geometric3_1.Geometric3.fromVector(direction).normalize();
        this.color_ = Color_1.Color.copy(color);
    }
    Object.defineProperty(DirectionalLight.prototype, "color", {
        get: function () {
            return this.color_;
        },
        set: function (color) {
            this.color_.copy(Color_1.Color.mustBe('color', color));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "direction", {
        get: function () {
            return this.direction_;
        },
        set: function (direction) {
            mustBeObject_1.mustBeObject('direction', direction);
            this.direction_.copy(direction);
        },
        enumerable: true,
        configurable: true
    });
    DirectionalLight.prototype.setUniforms = function (visitor) {
        var direction = this.direction_;
        visitor.uniform3f(GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z);
        var color = this.color_;
        visitor.uniform3f(GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b);
    };
    return DirectionalLight;
}());
exports.DirectionalLight = DirectionalLight;
