var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var uuid4 = require('../utils/uuid4');
var UniformMat4 = (function (_super) {
    __extends(UniformMat4, _super);
    function UniformMat4(name, id) {
        _super.call(this);
        this.useData = true;
        this.name = name;
        this.id = typeof id !== 'undefined' ? id : uuid4().generate();
    }
    Object.defineProperty(UniformMat4.prototype, "data", {
        set: function (data) {
            this.$data = data;
            this.useData = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformMat4.prototype, "callback", {
        set: function (callback) {
            this.$callback = callback;
            this.useData = false;
        },
        enumerable: true,
        configurable: true
    });
    UniformMat4.prototype.getUniformMatrix4 = function (name) {
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
                return _super.prototype.getUniformMatrix4.call(this, name);
            }
        }
    };
    UniformMat4.prototype.getUniformMetaInfos = function () {
        var uniforms = _super.prototype.getUniformMetaInfos.call(this);
        uniforms[this.id] = { name: this.name, glslType: 'mat4' };
        return uniforms;
    };
    return UniformMat4;
})(DefaultUniformProvider);
module.exports = UniformMat4;
