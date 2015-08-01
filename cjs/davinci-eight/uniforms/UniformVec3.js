var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var uuid4 = require('../utils/uuid4');
var expectArg = require('../checks/expectArg');
var UniformVec3 = (function (_super) {
    __extends(UniformVec3, _super);
    function UniformVec3(name, id) {
        _super.call(this);
        this.useData = false;
        this.useCallback = false;
        this.name = name;
        this.id = typeof id !== 'undefined' ? id : uuid4().generate();
    }
    Object.defineProperty(UniformVec3.prototype, "data", {
        get: function () {
            return this.$data;
        },
        set: function (data) {
            this.$data = data;
            if (typeof data !== void 0) {
                expectArg('data', data).toSatisfy(data.length === 3, "data.length must be 3");
                this.useData = true;
                this.useCallback = false;
            }
            else {
                this.useData = false;
                this.$callback = void 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformVec3.prototype, "callback", {
        set: function (callback) {
            this.$callback = callback;
            if (typeof callback !== void 0) {
                this.useCallback = true;
                this.useData = false;
            }
            else {
                this.useCallback = false;
                this.$data = void 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    UniformVec3.prototype.getUniformVector3 = function (name) {
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
                        var message = "uniform vec3 " + this.name + " has not been assigned a data or callback.";
                        console.warn(message);
                        throw new Error(message);
                    }
                }
                break;
            default: {
                return _super.prototype.getUniformVector3.call(this, name);
            }
        }
    };
    UniformVec3.prototype.getUniformMeta = function () {
        var uniforms = _super.prototype.getUniformMeta.call(this);
        uniforms[this.id] = { name: this.name, glslType: 'vec3' };
        return uniforms;
    };
    return UniformVec3;
})(DefaultUniformProvider);
module.exports = UniformVec3;
