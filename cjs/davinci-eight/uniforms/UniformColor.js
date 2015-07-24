var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var UniformVec4 = require('../uniforms/UniformVec4');
/**
 * Provides a uniform variable representing an ambient light.
 * @class UniformColor
 */
var UniformColor = (function (_super) {
    __extends(UniformColor, _super);
    /**
     * @class UniformColor
     * @constructor
     */
    function UniformColor(name, id) {
        _super.call(this);
        this.inner = new UniformVec4(name, id);
    }
    Object.defineProperty(UniformColor.prototype, "value", {
        set: function (color) {
            this.inner.value = [color.red, color.green, color.blue, color.alpha];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformColor.prototype, "callback", {
        set: function (callback) {
            this.inner.callback = function () {
                var color = callback();
                return [color.red, color.green, color.blue];
            };
        },
        enumerable: true,
        configurable: true
    });
    UniformColor.prototype.getUniformVector4 = function (name) {
        return this.inner.getUniformVector4(name);
    };
    UniformColor.prototype.getUniformMetaInfos = function () {
        return this.inner.getUniformMetaInfos();
    };
    return UniformColor;
})(DefaultUniformProvider);
module.exports = UniformColor;
