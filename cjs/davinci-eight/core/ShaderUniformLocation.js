/**
 * Utility class for managing a shader uniform variable.
 * @class ShaderUniformLocation
 */
var ShaderUniformLocation = (function () {
    /**
     * @class ShaderUniformLocation
     * @constructor
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     * @param glslType {string} The type of the uniform variale, as it appears in the GLSL shader code.
     */
    function ShaderUniformLocation(name, glslType) {
        this.name = name;
        switch (glslType) {
            case 'float':
            case 'vec2':
            case 'vec3':
            case 'vec4':
            case 'mat2':
            case 'mat3':
            case 'mat4':
                {
                    this.glslType = glslType;
                }
                break;
            default: {
                throw new Error("Illegal argument glslType in ShaderUniformLocation constructor: " + glslType);
            }
        }
    }
    /**
     * @method contextFree
     */
    ShaderUniformLocation.prototype.contextFree = function () {
        this.location = null;
        this.context = null;
    };
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     */
    ShaderUniformLocation.prototype.contextGain = function (context, program) {
        this.location = context.getUniformLocation(program, this.name);
        this.context = context;
    };
    /**
     * @method contextLoss
     */
    ShaderUniformLocation.prototype.contextLoss = function () {
        this.location = null;
        this.context = null;
    };
    /**
     * @method uniform1f
     * @param value {number} Value to assign.
     */
    ShaderUniformLocation.prototype.uniform1f = function (value) {
        this.context.uniform1f(this.location, value);
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
     * @method uniform3fv
     * @param data {number[]}
     */
    ShaderUniformLocation.prototype.uniform3fv = function (data) {
        this.context.uniform3fv(this.location, data);
    };
    /**
     * @method uniform4fv
     * @param data {number[]}
     */
    ShaderUniformLocation.prototype.uniform4fv = function (data) {
        this.context.uniform4fv(this.location, data);
    };
    /**
     * @method uniformMatrix3fv
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    ShaderUniformLocation.prototype.uniformMatrix3fv = function (transpose, matrix) {
        if (!(matrix instanceof Float32Array)) {
            throw new Error("matrix must be a Float32Array.");
        }
        this.context.uniformMatrix3fv(this.location, transpose, matrix);
    };
    /**
     * @method uniformMatrix4fv
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    ShaderUniformLocation.prototype.uniformMatrix4fv = function (transpose, matrix) {
        if (!(matrix instanceof Float32Array)) {
            throw new Error("matrix must be a Float32Array.");
        }
        this.context.uniformMatrix4fv(this.location, transpose, matrix);
    };
    /**
     * @method toString
     */
    ShaderUniformLocation.prototype.toString = function () {
        return ["ShaderUniformLocation({name: ", this.name, ", glslType: ", this.glslType + "})"].join('');
    };
    return ShaderUniformLocation;
})();
module.exports = ShaderUniformLocation;
