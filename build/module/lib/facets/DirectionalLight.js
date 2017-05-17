import { Color } from '../core/Color';
import { Geometric3 } from '../math/Geometric3';
import { mustBeObject } from '../checks/mustBeObject';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Vector3 } from '../math/Vector3';
/**
 *
 */
var DirectionalLight = (function () {
    function DirectionalLight(direction, color) {
        if (direction === void 0) { direction = Vector3.vector(0, 0, 1).neg(); }
        if (color === void 0) { color = Color.white; }
        mustBeObject('direction', direction);
        mustBeObject('color', color);
        this.direction_ = Geometric3.fromVector(direction).normalize();
        this.color_ = Color.copy(color);
    }
    Object.defineProperty(DirectionalLight.prototype, "color", {
        get: function () {
            return this.color_;
        },
        set: function (color) {
            this.color_.copy(Color.mustBe('color', color));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "direction", {
        get: function () {
            return this.direction_;
        },
        set: function (direction) {
            mustBeObject('direction', direction);
            this.direction_.copy(direction);
        },
        enumerable: true,
        configurable: true
    });
    DirectionalLight.prototype.setUniforms = function (visitor) {
        var direction = this.direction_;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z);
        var color = this.color_;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b);
    };
    return DirectionalLight;
}());
export { DirectionalLight };
