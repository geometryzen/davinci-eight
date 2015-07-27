var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Color = require('../core/Color');
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var UniformVec3 = require('../uniforms/UniformVec3');
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
        this.inner = new UniformVec3(name, id);
    }
    Object.defineProperty(UniformColor.prototype, "value", {
        get: function () {
            var value = this.inner.value;
            if (value) {
                return new Color(value);
            }
            else {
                return;
            }
        },
        set: function (color) {
            this.inner.value = color.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformColor.prototype, "callback", {
        set: function (callback) {
            this.inner.callback = function () {
                var color = callback();
                return color.data;
            };
        },
        enumerable: true,
        configurable: true
    });
    UniformColor.prototype.getUniformVector3 = function (name) {
        return this.inner.getUniformVector3(name);
    };
    UniformColor.prototype.getUniformMetaInfos = function () {
        return this.inner.getUniformMetaInfos();
    };
    return UniformColor;
})(DefaultUniformProvider);
module.exports = UniformColor;
