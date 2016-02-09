define(["require", "exports"], function (require, exports) {
    var UniformLocation = (function () {
        function UniformLocation(info) {
            this._name = info.name;
        }
        UniformLocation.prototype.contextFree = function () {
            this.contextLost();
        };
        UniformLocation.prototype.contextGain = function (context, program) {
            this.contextLost();
            this._context = context;
            this._location = context.getUniformLocation(program, this._name);
            this._program = program;
        };
        UniformLocation.prototype.contextLost = function () {
            this._context = void 0;
            this._location = void 0;
            this._program = void 0;
        };
        UniformLocation.prototype.vec1 = function (coords) {
            this._context.uniform1f(this._location, coords.x);
            return this;
        };
        UniformLocation.prototype.vec2 = function (coords) {
            this._context.uniform2f(this._location, coords.x, coords.y);
            return this;
        };
        UniformLocation.prototype.vec3 = function (coords) {
            this._context.uniform3f(this._location, coords.x, coords.y, coords.z);
            return this;
        };
        UniformLocation.prototype.vec4 = function (coords) {
            this._context.uniform4f(this._location, coords.x, coords.y, coords.z, coords.w);
            return this;
        };
        UniformLocation.prototype.uniform1f = function (x) {
            this._context.uniform1f(this._location, x);
        };
        UniformLocation.prototype.uniform2f = function (x, y) {
            this._context.uniform2f(this._location, x, y);
        };
        UniformLocation.prototype.uniform3f = function (x, y, z) {
            this._context.uniform3f(this._location, x, y, z);
        };
        UniformLocation.prototype.uniform4f = function (x, y, z, w) {
            this._context.uniform4f(this._location, x, y, z, w);
        };
        UniformLocation.prototype.mat2 = function (matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            this._context.uniformMatrix2fv(this._location, transpose, matrix.elements);
            return this;
        };
        UniformLocation.prototype.mat3 = function (matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            this._context.uniformMatrix3fv(this._location, transpose, matrix.elements);
            return this;
        };
        UniformLocation.prototype.mat4 = function (matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            this._context.uniformMatrix4fv(this._location, transpose, matrix.elements);
            return this;
        };
        UniformLocation.prototype.vector2 = function (data) {
            this._context.uniform2fv(this._location, data);
        };
        UniformLocation.prototype.vector3 = function (data) {
            this._context.uniform3fv(this._location, data);
        };
        UniformLocation.prototype.vector4 = function (data) {
            this._context.uniform4fv(this._location, data);
        };
        UniformLocation.prototype.toString = function () {
            return ['uniform', this._name].join(' ');
        };
        return UniformLocation;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UniformLocation;
});
