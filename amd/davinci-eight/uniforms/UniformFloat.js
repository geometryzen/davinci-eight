var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../uniforms/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
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
            this.$value = 0;
            this.useValue = false;
            this.useCallback = false;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformFloat.prototype, "value", {
            set: function (value) {
                this.$value = value;
                if (typeof value !== void 0) {
                    this.useValue = true;
                    this.useCallback = false;
                }
                else {
                    this.useValue = false;
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
                    this.useValue = false;
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
                        if (this.useValue) {
                            return this.$value;
                        }
                        else if (this.useCallback) {
                            return this.$callback();
                        }
                        else {
                            var message = "uniform float " + this.name + " has not been assigned a value or callback.";
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
        UniformFloat.prototype.getUniformMetaInfos = function () {
            var uniforms = _super.prototype.getUniformMetaInfos.call(this);
            uniforms[this.id] = { name: this.name, glslType: 'float' };
            return uniforms;
        };
        return UniformFloat;
    })(DefaultUniformProvider);
    return UniformFloat;
});
