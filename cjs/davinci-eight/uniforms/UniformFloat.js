var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var uuid4 = require('../utils/uuid4');
/**
 * @class UniformFloat
 */
var UniformFloat = (function (_super) {
    __extends(UniformFloat, _super);
    /**
     * @class UniformFloat
     * @constructor
     * @param name {string}
     * @param name {id}
     */
    function UniformFloat(name, id) {
        _super.call(this);
        this.$data = 0;
        this.useData = false;
        this.useCallback = false;
        this.name = name;
        this.id = typeof id !== 'undefined' ? id : uuid4().generate();
    }
    Object.defineProperty(UniformFloat.prototype, "data", {
        set: function (data) {
            this.$data = data;
            if (typeof data !== void 0) {
                this.useData = true;
                this.useCallback = false;
            }
            else {
                this.useData = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformFloat.prototype, "callback", {
        set: function (callback) {
            this.$callback = callback;
            if (typeof callback !== void 0) {
                this.useCallback = true;
                this.useData = false;
            }
            else {
                this.useCallback = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    UniformFloat.prototype.getUniformFloat = function (name) {
        switch (name) {
            case this.name:
                {
                    if (this.useData) {
                        return this.$data;
                    }
                    else if (this.useCallback) {
                        return this.$callback();
                    }
                    else {
                        var message = "uniform float " + this.name + " has not been assigned a data or callback.";
                        console.warn(message);
                        throw new Error(message);
                    }
                }
                break;
            default: {
                return _super.prototype.getUniformFloat.call(this, name);
            }
        }
    };
    UniformFloat.prototype.getUniformMeta = function () {
        var uniforms = _super.prototype.getUniformMeta.call(this);
        uniforms[this.id] = { name: this.name, glslType: 'float' };
        return uniforms;
    };
    return UniformFloat;
})(DefaultUniformProvider);
module.exports = UniformFloat;
