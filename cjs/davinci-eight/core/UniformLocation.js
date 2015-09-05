var expectArg = require('../checks/expectArg');
/**
 * Utility class for managing a shader uniform variable.
 * @class UniformLocation
 */
var UniformLocation = (function () {
    /**
     * @class UniformLocation
     * @constructor
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     */
    function UniformLocation(name) {
        this._name = expectArg('name', name).toBeString().value;
    }
    /**
     * @method contextFree
     */
    UniformLocation.prototype.contextFree = function () {
        this._location = void 0;
        this._context = void 0;
    };
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     */
    UniformLocation.prototype.contextGain = function (context, program) {
        if (this._context !== context) {
            this._location = context.getUniformLocation(program, this._name);
            this._context = context;
        }
    };
    /**
     * @method contextLoss
     */
    UniformLocation.prototype.contextLoss = function () {
        this._location = void 0;
        this._context = void 0;
    };
    /**
     * @method uniform1f
     * @param x
     */
    UniformLocation.prototype.uniform1f = function (x) {
        return this._context.uniform1f(this._location, x);
    };
    /**
     * @method uniform2f
     * @param x {number}
     * @param y {number}
     */
    UniformLocation.prototype.uniform2f = function (x, y) {
        return this._context.uniform2f(this._location, x, y);
    };
    /**
     * @method uniform3f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    UniformLocation.prototype.uniform3f = function (x, y, z) {
        return this._context.uniform3f(this._location, x, y, z);
    };
    /**
     * @method uniform4f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param w {number}
     */
    UniformLocation.prototype.uniform4f = function (x, y, z, w) {
        return this._context.uniform4f(this._location, x, y, z, w);
    };
    /**
     * @method matrix1
     * @param transpose {boolean}
     * @param matrix {Matrix1}
     */
    UniformLocation.prototype.matrix1 = function (transpose, matrix) {
        return this._context.uniform1fv(this._location, matrix.data);
    };
    /**
     * @method matrix2
     * @param transpose {boolean}
     * @param matrix {Matrix2}
     */
    UniformLocation.prototype.matrix2 = function (transpose, matrix) {
        return this._context.uniformMatrix2fv(this._location, transpose, matrix.data);
    };
    /**
     * @method matrix3
     * @param transpose {boolean}
     * @param matrix {Matrix3}
     */
    UniformLocation.prototype.matrix3 = function (transpose, matrix) {
        return this._context.uniformMatrix3fv(this._location, transpose, matrix.data);
    };
    /**
     * @method matrix4
     * @param transpose {boolean}
     * @param matrix {Matrix4}
     */
    UniformLocation.prototype.matrix4 = function (transpose, matrix) {
        return this._context.uniformMatrix4fv(this._location, transpose, matrix.data);
    };
    /**
     * @method vector1
     * @param vector {Vector1}
     */
    UniformLocation.prototype.vector1 = function (vector) {
        return this._context.uniform1fv(this._location, vector.data);
    };
    /**
     * @method vector2
     * @param vector {Vector2}
     */
    UniformLocation.prototype.vector2 = function (vector) {
        return this._context.uniform2fv(this._location, vector.data);
    };
    /**
     * @method vector3
     * @param vector {Vector3}
     */
    UniformLocation.prototype.vector3 = function (vector) {
        return this._context.uniform3fv(this._location, vector.data);
    };
    /**
     * @method vector4
     * @param vector {Vector4}
     */
    UniformLocation.prototype.vector4 = function (vector) {
        return this._context.uniform4fv(this._location, vector.data);
    };
    /**
     * @method toString
     */
    UniformLocation.prototype.toString = function () {
        return ['uniform', this._name].join(' ');
    };
    return UniformLocation;
})();
module.exports = UniformLocation;
