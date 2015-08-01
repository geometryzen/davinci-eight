var Color = require('../core/Color');
var Vector3 = require('../math/Vector3');
var Symbolic = require('../core/Symbolic');
var UniformColor = require('../uniforms/UniformColor');
var UniformVector3 = require('../uniforms/UniformVector3');
var MultiUniformProvider = require('../uniforms/MultiUniformProvider');
var DEFAULT_UNIFORM_POINT_LIGHT_NAME = 'u' + Symbolic.UNIFORM_POINT_LIGHT;
/**
 * Provides a uniform variable representing a point light.
 * @class PointLight
 */
var PointLight = (function () {
    /**
     * @class PointLight
     * @constructor
     */
    function PointLight(options) {
        options = options || {};
        options.color = options.color || new Color([1.0, 1.0, 1.0]);
        options.position = options.position || new Vector3([0.0, 0.0, 0.0]);
        options.name = options.name || DEFAULT_UNIFORM_POINT_LIGHT_NAME;
        this.uColor = new UniformColor(options.name + 'Color', Symbolic.UNIFORM_POINT_LIGHT_COLOR);
        this.uPosition = new UniformVector3(options.name + 'Position', Symbolic.UNIFORM_POINT_LIGHT_POSITION);
        this.multi = new MultiUniformProvider([this.uColor, this.uPosition]);
        this.uColor.data = options.color;
        this.uPosition.data = options.position;
    }
    Object.defineProperty(PointLight.prototype, "color", {
        get: function () {
            return this.uColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointLight.prototype, "position", {
        get: function () {
            return this.uPosition;
        },
        enumerable: true,
        configurable: true
    });
    PointLight.prototype.getUniformFloat = function (name) {
        return this.multi.getUniformFloat(name);
    };
    PointLight.prototype.getUniformMatrix2 = function (name) {
        return this.multi.getUniformMatrix2(name);
    };
    PointLight.prototype.getUniformMatrix3 = function (name) {
        return this.multi.getUniformMatrix3(name);
    };
    PointLight.prototype.getUniformMatrix4 = function (name) {
        return this.multi.getUniformMatrix4(name);
    };
    PointLight.prototype.getUniformVector2 = function (name) {
        return this.multi.getUniformVector2(name);
    };
    PointLight.prototype.getUniformVector3 = function (name) {
        return this.multi.getUniformVector3(name);
    };
    PointLight.prototype.getUniformVector4 = function (name) {
        return this.multi.getUniformVector4(name);
    };
    PointLight.prototype.getUniformMeta = function () {
        return this.multi.getUniformMeta();
    };
    return PointLight;
})();
module.exports = PointLight;
