var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../core/Color', '../core/DefaultUniformProvider', '../uniforms/UniformVec3'], function (require, exports, Color, DefaultUniformProvider, UniformVec3) {
    /**
     * Provides a uniform variable representing an ambient light.
     * @class UniformColor
     */
    var UniformColor = (function (_super) {
        __extends(UniformColor, _super);
        /**
         * @class UniformColor
         * @constructor
         */
        function UniformColor(name, id) {
            _super.call(this);
            this.inner = new UniformVec3(name, id);
        }
        Object.defineProperty(UniformColor.prototype, "data", {
            get: function () {
                var data = this.inner.data;
                if (data) {
                    return new Color(data);
                }
                else {
                    return;
                }
            },
            set: function (color) {
                this.inner.data = color.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformColor.prototype, "callback", {
            set: function (callback) {
                this.inner.callback = function () {
                    var color = callback();
                    return color.data;
                };
            },
            enumerable: true,
            configurable: true
        });
        UniformColor.prototype.getUniformVector3 = function (name) {
            return this.inner.getUniformVector3(name);
        };
        UniformColor.prototype.getUniformMeta = function () {
            return this.inner.getUniformMeta();
        };
        UniformColor.prototype.getUniformData = function () {
            return this.inner.getUniformData();
        };
        return UniformColor;
    })(DefaultUniformProvider);
    return UniformColor;
});
