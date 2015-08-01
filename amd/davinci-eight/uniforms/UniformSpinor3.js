var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../math/Spinor3', '../uniforms/DefaultUniformProvider', '../uniforms/UniformVec4'], function (require, exports, Spinor3, DefaultUniformProvider, UniformVec4) {
    /**
     * Provides a uniform variable representing an ambient light.
     * @class UniformSpinor3
     */
    var UniformSpinor3 = (function (_super) {
        __extends(UniformSpinor3, _super);
        /**
         * @class UniformSpinor3
         * @constructor
         */
        function UniformSpinor3(name, id) {
            _super.call(this);
            this.inner = new UniformVec4(name, id);
        }
        Object.defineProperty(UniformSpinor3.prototype, "data", {
            get: function () {
                var data = this.inner.data;
                if (data) {
                    return new Spinor3(data);
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
        Object.defineProperty(UniformSpinor3.prototype, "callback", {
            set: function (callback) {
                this.inner.callback = function () {
                    var vector = callback();
                    return vector.data;
                };
            },
            enumerable: true,
            configurable: true
        });
        UniformSpinor3.prototype.getUniformVector4 = function (name) {
            return this.inner.getUniformVector4(name);
        };
        UniformSpinor3.prototype.getUniformMeta = function () {
            return this.inner.getUniformMeta();
        };
        return UniformSpinor3;
    })(DefaultUniformProvider);
    return UniformSpinor3;
});
