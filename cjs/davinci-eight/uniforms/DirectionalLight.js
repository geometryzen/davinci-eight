var Color = require('../core/Color');
var MultiUniformProvider = require('../uniforms/MultiUniformProvider');
var Symbolic = require('../core/Symbolic');
var UniformColor = require('../uniforms/UniformColor');
var UniformVector3 = require('../uniforms/UniformVector3');
var Vector3 = require('../math/Vector3');
var isDefined = require('../checks/isDefined');
/**
 * Provides a uniform variable representing a directional light.
 * @class DirectionalLight
 */
var DirectionalLight = (function () {
    /**
     * @class DirectionalLight
     * @constructor
     */
    function DirectionalLight(options) {
        options = options || {};
        options.color = options.color || new Color([1.0, 1.0, 1.0]);
        options.direction = options.direction || new Vector3([0.0, 0.0, -1.0]);
        var colorName = isDefined(options.name) ? options.name + 'Color' : void 0;
        var directionName = isDefined(options.name) ? options.name + 'Direction' : void 0;
        this.uColor = new UniformColor(colorName, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR);
        this.uDirection = new UniformVector3(directionName, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION);
        this.multi = new MultiUniformProvider([this.uColor, this.uDirection]);
        this.uColor.data = options.color;
        this.uDirection.data = options.direction;
    }
    Object.defineProperty(DirectionalLight.prototype, "color", {
        get: function () {
            return this.uColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "direction", {
        get: function () {
            return this.uDirection;
        },
        enumerable: true,
        configurable: true
    });
    DirectionalLight.prototype.getUniformFloat = function (name) {
        return this.multi.getUniformFloat(name);
    };
    DirectionalLight.prototype.getUniformMatrix2 = function (name) {
        return this.multi.getUniformMatrix2(name);
    };
    DirectionalLight.prototype.getUniformMatrix3 = function (name) {
        return this.multi.getUniformMatrix3(name);
    };
    DirectionalLight.prototype.getUniformMatrix4 = function (name) {
        return this.multi.getUniformMatrix4(name);
    };
    DirectionalLight.prototype.getUniformVector2 = function (name) {
        return this.multi.getUniformVector2(name);
    };
    DirectionalLight.prototype.getUniformVector3 = function (name) {
        return this.multi.getUniformVector3(name);
    };
    DirectionalLight.prototype.getUniformVector4 = function (name) {
        return this.multi.getUniformVector4(name);
    };
    DirectionalLight.prototype.getUniformMeta = function () {
        return this.multi.getUniformMeta();
    };
    return DirectionalLight;
})();
module.exports = DirectionalLight;
