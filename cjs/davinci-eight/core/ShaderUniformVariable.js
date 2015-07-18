/**
 * Utility class for managing a shader uniform variable.
 * @class ShaderUniformVariable
 */
var ShaderUniformVariable = (function () {
    /**
     * @class ShaderUniformVariable
     * @constructor
     * @param name {string} The name of the uniform variable, as it appears in the vertex shader code.
     * @param type {string} The type of the uniform variale, as it appears in the vertex shader code.
     */
    function ShaderUniformVariable(name, type) {
        this.name = name;
        this.type = type;
        switch (type) {
            case 'vec3':
            case 'mat3':
            case 'mat4':
                {
                }
                break;
            default: {
                throw new Error("Illegal argument type in uniform constructor: " + type);
            }
        }
    }
    /**
     * @method contextFree
     */
    ShaderUniformVariable.prototype.contextFree = function () {
        this.location = null;
        this.context = null;
    };
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     */
    ShaderUniformVariable.prototype.contextGain = function (context, program) {
        this.location = context.getUniformLocation(program, this.name);
        this.context = context;
    };
    /**
     * @method contextLoss
     */
    ShaderUniformVariable.prototype.contextLoss = function () {
        this.location = null;
        this.context = null;
    };
    /**
     * @method vec3
     * @param data {number[]}
     */
    ShaderUniformVariable.prototype.vec3 = function (data) {
        this.context.uniform3fv(this.location, data);
    };
    /**
     * @method mat3
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    ShaderUniformVariable.prototype.mat3 = function (transpose, matrix) {
        if (!(matrix instanceof Float32Array)) {
            throw new Error("matrix must be a Float32Array.");
        }
        this.context.uniformMatrix3fv(this.location, transpose, matrix);
    };
    /**
     * @method mat4
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    ShaderUniformVariable.prototype.mat4 = function (transpose, matrix) {
        if (!(matrix instanceof Float32Array)) {
            throw new Error("matrix must be a Float32Array.");
        }
        this.context.uniformMatrix4fv(this.location, transpose, matrix);
    };
    /**
     * @method toString
     */
    ShaderUniformVariable.prototype.toString = function () {
        return ["ShaderUniformVariable({name: ", this.name, ", type: ", this.type + "})"].join('');
    };
    return ShaderUniformVariable;
})();
module.exports = ShaderUniformVariable;
