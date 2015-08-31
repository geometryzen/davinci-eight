var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../core/DefaultUniformProvider', '../utils/uuid4', '../checks/isDefined'], function (require, exports, DefaultUniformProvider, uuid4, isDefined) {
    var UniformMat4 = (function (_super) {
        __extends(UniformMat4, _super);
        function UniformMat4(name, id) {
            _super.call(this);
            this.useData = true;
            this.$name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
            this.$varName = isDefined(this.$name) ? this.$name : this.id;
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
        UniformMat4.prototype.getValue = function () {
            if (this.useData) {
                return this.$data;
            }
            else {
                return this.$callback();
            }
        };
        UniformMat4.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case this.$varName:
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
        UniformMat4.prototype.getUniformMeta = function () {
            var uniforms = _super.prototype.getUniformMeta.call(this);
            if (isDefined(this.$name)) {
                uniforms[this.id] = { name: this.$name, glslType: 'mat4' };
            }
            else {
                uniforms[this.id] = { glslType: 'mat4' };
            }
            return uniforms;
        };
        UniformMat4.prototype.getUniformData = function () {
            var data = _super.prototype.getUniformData.call(this);
            var value = this.getValue();
            var m4 = { transpose: value.transpose, matrix3: void 0, matrix4: value.matrix4, uniformZs: void 0 };
            if (isDefined(this.$name)) {
                data[this.$name] = m4;
            }
            else {
                data[this.id] = m4;
            }
            return data;
        };
        return UniformMat4;
    })(DefaultUniformProvider);
    return UniformMat4;
});
