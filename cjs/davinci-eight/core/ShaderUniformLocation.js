/**
 * Utility class for managing a shader uniform variable.
 * @class ShaderUniformLocation
 */
var ShaderUniformLocation = (function () {
    /**
     * @class ShaderUniformLocation
     * @constructor
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     */
    function ShaderUniformLocation(name) {
        this.name = name;
    }
    /**
     * @method contextFree
     */
    ShaderUniformLocation.prototype.contextFree = function () {
        this.location = void 0;
        this.context = void 0;
    };
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     */
    ShaderUniformLocation.prototype.contextGain = function (context, program) {
        if (this.context !== context) {
            this.location = context.getUniformLocation(program, this.name);
            this.context = context;
        }
    };
    /**
     * @method contextLoss
     */
    ShaderUniformLocation.prototype.contextLoss = function () {
        this.location = void 0;
        this.context = void 0;
    };
    /**
     * @method uniform1f
     * @param x {number} Value to assign.
     */
    ShaderUniformLocation.prototype.uniform1f = function (x) {
        this.context.uniform1f(this.location, x);
    };
    /**
     * @method uniform1fv
     * @param data {number[]}
     */
    ShaderUniformLocation.prototype.uniform1fv = function (data) {
        this.context.uniform1fv(this.location, data);
    };
    /**
     * @method uniform2f
     * @param x {number} Horizontal value to assign.
     * @param y {number} Vertical number to assign.
     */
    ShaderUniformLocation.prototype.uniform2f = function (x, y) {
        this.context.uniform2f(this.location, x, y);
    };
    /**
     * @method uniform2fv
     * @param data {number[]}
     */
    ShaderUniformLocation.prototype.uniform2fv = function (data) {
        this.context.uniform2fv(this.location, data);
    };
    /**
     * @method uniform3f
     * @param x {number} Horizontal value to assign.
     * @param y {number} Vertical number to assign.
     * @param z {number}
     */
    ShaderUniformLocation.prototype.uniform3f = function (x, y, z) {
        this.context.uniform3f(this.location, x, y, z);
    };
    /**
     * @method uniform3f
     * @param x {number} Horizontal value to assign.
     * @param y {number} Vertical number to assign.
     * @param z {number}
     * @param w {number}
     */
    ShaderUniformLocation.prototype.uniform4f = function (x, y, z, w) {
        this.context.uniform4f(this.location, x, y, z, w);
    };
    /**
     * @method uniform4fv
     * @param data {number[]}
     */
    ShaderUniformLocation.prototype.uniform4fv = function (data) {
        this.context.uniform4fv(this.location, data);
    };
    /**
     * @method uniformMatrix2
     * @param transpose {boolean}
     * @param matrix {Matrix2}
     */
    ShaderUniformLocation.prototype.uniformMatrix2 = function (transpose, matrix) {
        this.context.uniformMatrix2fv(this.location, transpose, matrix.elements);
    };
    /**
     * @method uniformMatrix3
     * @param transpose {boolean}
     * @param matrix {Matrix3}
     */
    ShaderUniformLocation.prototype.uniformMatrix3 = function (transpose, matrix) {
        this.context.uniformMatrix3fv(this.location, transpose, matrix.elements);
    };
    /**
     * @method uniformMatrix4
     * @param transpose {boolean}
     * @param matrix {Matrix4}
     */
    ShaderUniformLocation.prototype.uniformMatrix4 = function (transpose, matrix) {
        this.context.uniformMatrix4fv(this.location, transpose, matrix.elements);
    };
    /**
     * @method uniformVector3
     * @param vector {Vector3}
     */
    ShaderUniformLocation.prototype.uniformVector3 = function (vector) {
        // The v argument is either a number[] or a Float32Array.
        // In our case we supply number[].
        this.context.uniform3fv(this.location, vector.data);
    };
    /**
     * @method toString
     */
    ShaderUniformLocation.prototype.toString = function () {
        return ["ShaderUniformLocation(", this.name, ")"].join('');
    };
    return ShaderUniformLocation;
})();
module.exports = ShaderUniformLocation;
