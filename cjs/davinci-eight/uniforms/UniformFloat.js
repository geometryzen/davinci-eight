var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var uuid4 = require('../utils/uuid4');
var UniformFloat = (function (_super) {
    __extends(UniformFloat, _super);
    function UniformFloat(name, id) {
        _super.call(this);
        this.$value = 0;
        this.useValue = true;
        this.name = name;
        this.id = typeof id !== 'undefined' ? id : uuid4().generate();
    }
    Object.defineProperty(UniformFloat.prototype, "value", {
        set: function (value) {
            this.$value = value;
            this.useValue = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformFloat.prototype, "callback", {
        set: function (callback) {
            this.$callback = callback;
            this.useValue = false;
        },
        enumerable: true,
        configurable: true
    });
    UniformFloat.prototype.getUniformFloat = function (name) {
        switch (name) {
            case this.name:
                {
                    if (this.useValue) {
                        return this.$value;
                    }
                    else {
                        return this.$callback();
                    }
                }
                break;
            default: {
                return _super.prototype.getUniformFloat.call(this, name);
            }
        }
    };
    UniformFloat.prototype.getUniformMetaInfos = function () {
        var uniforms = _super.prototype.getUniformMetaInfos.call(this);
        uniforms[this.id] = { name: this.name, glslType: 'float' };
        return uniforms;
    };
    return UniformFloat;
})(DefaultUniformProvider);
module.exports = UniformFloat;
