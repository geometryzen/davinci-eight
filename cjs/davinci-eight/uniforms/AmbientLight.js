var Color = require('../core/Color');
var Symbolic = require('../core/Symbolic');
var UniformColor = require('../uniforms/UniformColor');
var expectArg = require('../checks/expectArg');
/**
 * Default varaible name in GLSL follows naming conventions.
 */
var DEFAULT_UNIFORM_AMBIENT_LIGHT_NAME = 'u' + Symbolic.UNIFORM_AMBIENT_LIGHT;
/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
var AmbientLight = (function () {
    /**
     * @class AmbientLight
     * @constructor
     * @param name {string} The name of the uniform variable. Defaults to Symbolic.UNIFORM_AMBIENT_LIGHT.
     */
    function AmbientLight(name) {
        if (name === void 0) { name = DEFAULT_UNIFORM_AMBIENT_LIGHT_NAME; }
        // TODO: Need to have a test for valid variable names in GLSL...
        expectArg('name', name).toBeString().toSatisfy(name.length > 0, "name must have at least one character");
        this.$uColor = new UniformColor(name, Symbolic.UNIFORM_AMBIENT_LIGHT);
        this.uColor.data = new Color([1.0, 1.0, 1.0]);
    }
    Object.defineProperty(AmbientLight.prototype, "uColor", {
        get: function () {
            return this.$uColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmbientLight.prototype, "color", {
        set: function (color) {
            this.uColor.data = color;
        },
        enumerable: true,
        configurable: true
    });
    AmbientLight.prototype.getUniformFloat = function (name) {
        return this.uColor.getUniformFloat(name);
    };
    AmbientLight.prototype.getUniformMatrix2 = function (name) {
        return this.uColor.getUniformMatrix2(name);
    };
    AmbientLight.prototype.getUniformMatrix3 = function (name) {
        return this.uColor.getUniformMatrix3(name);
    };
    AmbientLight.prototype.getUniformMatrix4 = function (name) {
        return this.uColor.getUniformMatrix4(name);
    };
    AmbientLight.prototype.getUniformVector2 = function (name) {
        return this.uColor.getUniformVector2(name);
    };
    AmbientLight.prototype.getUniformVector3 = function (name) {
        return this.uColor.getUniformVector3(name);
    };
    AmbientLight.prototype.getUniformVector4 = function (name) {
        return this.uColor.getUniformVector4(name);
    };
    AmbientLight.prototype.getUniformMetaInfos = function () {
        return this.uColor.getUniformMetaInfos();
    };
    return AmbientLight;
})();
module.exports = AmbientLight;
