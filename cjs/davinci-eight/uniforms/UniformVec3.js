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
        this.useValue = false;
        this.useCallback = false;
        this.name = name;
        this.id = typeof id !== 'undefined' ? id : uuid4().generate();
    }
    Object.defineProperty(UniformVec3.prototype, "value", {
        get: function () {
            return this.$value;
        },
        set: function (value) {
            this.$value = value;
            if (typeof value !== void 0) {
                expectArg('value', value).toSatisfy(value.length === 3, "value.length must be 3");
                this.useValue = true;
                this.useCallback = false;
            }
            else {
                this.useValue = false;
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
                this.useValue = false;
            }
            else {
                this.useCallback = false;
                this.$value = void 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    UniformVec3.prototype.getUniformVector3 = function (name) {
        switch (name) {
            case this.name:
                {
                    if (this.useValue) {
                        return this.$value;
                    }
                    else if (this.useCallback) {
                        return this.$callback();
                    }
                    else {
                        var message = "uniform vec3 " + this.name + " has not been assigned a value or callback.";
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
    UniformVec3.prototype.getUniformMetaInfos = function () {
        var uniforms = _super.prototype.getUniformMetaInfos.call(this);
        uniforms[this.id] = { name: this.name, glslType: 'vec3' };
        return uniforms;
    };
    return UniformVec3;
})(DefaultUniformProvider);
module.exports = UniformVec3;
