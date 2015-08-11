var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultUniformProvider = require('../core/DefaultUniformProvider');
var uuid4 = require('../utils/uuid4');
var expectArg = require('../checks/expectArg');
var UniformVec4 = (function (_super) {
    __extends(UniformVec4, _super);
    function UniformVec4(name, id) {
        _super.call(this);
        this.$data = [0, 0, 0];
        this.useData = true;
        this.name = name;
        this.id = typeof id !== 'undefined' ? id : uuid4().generate();
    }
    Object.defineProperty(UniformVec4.prototype, "data", {
        set: function (data) {
            expectArg('data', data).toSatisfy(data.length === 4, "data length must be 4");
            this.$data = data;
            this.useData = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformVec4.prototype, "callback", {
        set: function (callback) {
            this.$callback = callback;
            this.useData = false;
        },
        enumerable: true,
        configurable: true
    });
    UniformVec4.prototype.getUniformVector4 = function (name) {
        switch (name) {
            case this.name:
                {
                    if (this.useData) {
                        return this.$data;
                    }
                    else {
                        return this.$callback();
                    }
                }
                break;
            default: {
                return _super.prototype.getUniformVector4.call(this, name);
            }
        }
    };
    UniformVec4.prototype.getUniformMeta = function () {
        var uniforms = _super.prototype.getUniformMeta.call(this);
        uniforms[this.id] = { name: this.name, glslType: 'vec4' };
        return uniforms;
    };
    return UniformVec4;
})(DefaultUniformProvider);
module.exports = UniformVec4;
