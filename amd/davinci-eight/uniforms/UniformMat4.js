var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../uniforms/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
    var UniformMat4 = (function (_super) {
        __extends(UniformMat4, _super);
        function UniformMat4(name, id) {
            _super.call(this);
            this.useValue = true;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformMat4.prototype, "value", {
            set: function (value) {
                this.$value = value;
                this.useValue = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformMat4.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                this.useValue = false;
            },
            enumerable: true,
            configurable: true
        });
        UniformMat4.prototype.getUniformMatrix4 = function (name) {
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
    return UniformMat4;
});
