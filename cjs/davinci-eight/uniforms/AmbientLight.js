var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Symbolic = require('../core/Symbolic');
var UniformColor = require('../uniforms/UniformColor');
var UNIFORM_AMBIENT_LIGHT_NAME = Symbolic.UNIFORM_AMBIENT_LIGHT;
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
        _super.call(this, UNIFORM_AMBIENT_LIGHT_NAME, Symbolic.UNIFORM_AMBIENT_LIGHT);
        this.value = color;
    }
    return AmbientLight;
})(UniformColor);
module.exports = AmbientLight;
