var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3 = require('../math/Vector3');
var DefaultUniformProvider = require('../core/DefaultUniformProvider');
var UniformVec3 = require('../uniforms/UniformVec3');
/**
 * Provides a uniform variable with the Vector3 data type.
 * @class UniformVector3
 */
var UniformVector3 = (function (_super) {
    __extends(UniformVector3, _super);
    /**
     * @class UniformVector3
     * @constructor
     */
    function UniformVector3(name, id) {
        _super.call(this);
        this.inner = new UniformVec3(name, id);
    }
    Object.defineProperty(UniformVector3.prototype, "data", {
        get: function () {
            var data = this.inner.data;
            if (data) {
                return new Vector3(data);
            }
            else {
                return;
            }
        },
        set: function (vector) {
            this.inner.data = vector.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformVector3.prototype, "callback", {
        set: function (callback) {
            this.inner.callback = function () {
                var vector = callback();
                return vector.data;
            };
        },
        enumerable: true,
        configurable: true
    });
    UniformVector3.prototype.getUniformVector3 = function (name) {
        return this.inner.getUniformVector3(name);
    };
    UniformVector3.prototype.getUniformMeta = function () {
        return this.inner.getUniformMeta();
    };
    UniformVector3.prototype.getUniformData = function () {
        return this.inner.getUniformData();
    };
    return UniformVector3;
})(DefaultUniformProvider);
module.exports = UniformVector3;
