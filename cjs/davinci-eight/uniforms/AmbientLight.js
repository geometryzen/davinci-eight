var Symbolic = require('../core/Symbolic');
var Vector3 = require('../math/Vector3');
var UNIFORM_AMBIENT_LIGHT_NAME = 'uAmbientLight';
var UNIFORM_AMBIENT_LIGHT_TYPE = 'vec3';
/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
var AmbientLight = (function () {
    /**
     * @class AmbientLight
     * @constructor
     */
    function AmbientLight(color) {
        this.color = color;
    }
    AmbientLight.prototype.getUniformVector3 = function (name) {
        switch (name) {
            case UNIFORM_AMBIENT_LIGHT_NAME: {
                return new Vector3({ x: this.color.red, y: this.color.green, z: this.color.blue });
            }
            default: {
                return null; // base.getUniformVector3(name);
            }
        }
    };
    AmbientLight.prototype.getUniformMatrix3 = function (name) {
        return null;
    };
    AmbientLight.prototype.getUniformMatrix4 = function (name) {
        return null;
    };
    AmbientLight.prototype.getUniformMetaInfos = function () {
        var uniforms = {};
        uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] = { name: UNIFORM_AMBIENT_LIGHT_NAME, type: UNIFORM_AMBIENT_LIGHT_TYPE };
        return uniforms;
    };
    return AmbientLight;
})();
module.exports = AmbientLight;
