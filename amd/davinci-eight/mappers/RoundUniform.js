define(["require", "exports"], function (require, exports) {
    var RoundUniform = (function () {
        function RoundUniform() {
        }
        Object.defineProperty(RoundUniform.prototype, "next", {
            get: function () {
                // FIXME: No reference counting yet.
                return this._next;
            },
            set: function (next) {
                // FIXME: No reference counting yet.
                this._next = next;
            },
            enumerable: true,
            configurable: true
        });
        RoundUniform.prototype.uniform1f = function (name, x, canvasId) {
            if (this._next) {
                this._next.uniform1f(name, Math.round(x), canvasId);
            }
        };
        RoundUniform.prototype.uniform2f = function (name, x, y) {
            console.warn("uniform");
        };
        RoundUniform.prototype.uniform3f = function (name, x, y, z) {
            console.warn("uniform");
        };
        RoundUniform.prototype.uniform4f = function (name, x, y, z, w) {
            console.warn("uniform");
        };
        RoundUniform.prototype.mat2 = function (name, matrix, transpose) {
            console.warn("uniform");
        };
        RoundUniform.prototype.mat3 = function (name, matrix, transpose) {
            console.warn("uniform");
        };
        RoundUniform.prototype.mat4 = function (name, matrix, transpose) {
            console.warn("uniform");
        };
        RoundUniform.prototype.vec2 = function (name, vector) {
            console.warn("vec2");
        };
        RoundUniform.prototype.vec3 = function (name, vector) {
            console.warn("vec3");
        };
        RoundUniform.prototype.vec4 = function (name, vector) {
            console.warn("vec4");
        };
        RoundUniform.prototype.vector2 = function (name, data, canvasId) {
            this._next.vector2(name, data, canvasId);
        };
        RoundUniform.prototype.vector3 = function (name, data, canvasId) {
            this._next.vector3(name, data, canvasId);
        };
        RoundUniform.prototype.vector4 = function (name, data, canvasId) {
            this._next.vector4(name, data, canvasId);
        };
        return RoundUniform;
    })();
    return RoundUniform;
});
