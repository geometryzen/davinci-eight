var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Symbolic = require('../core/Symbolic');
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var UNIFORM_AMBIENT_LIGHT_NAME = 'uAmbientLight';
var UNIFORM_AMBIENT_LIGHT_TYPE = 'vec3';
/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
var AmbientLight = (function (_super) {
    __extends(AmbientLight, _super);
    /**
     * @class AmbientLight
     * @constructor
     */
    function AmbientLight(color) {
        _super.call(this);
        this.color = color;
    }
    AmbientLight.prototype.getUniformVector3 = function (name) {
        switch (name) {
            case UNIFORM_AMBIENT_LIGHT_NAME: {
                return [this.color.red, this.color.green, this.color.blue];
            }
            default: {
                return _super.prototype.getUniformVector3.call(this, name);
            }
        }
    };
    AmbientLight.prototype.getUniformMetaInfos = function () {
        var uniforms = {};
        uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] = { name: UNIFORM_AMBIENT_LIGHT_NAME, glslType: UNIFORM_AMBIENT_LIGHT_TYPE };
        return uniforms;
    };
    return AmbientLight;
})(DefaultUniformProvider);
module.exports = AmbientLight;
