define(["require", "exports"], function (require, exports) {
    /**
     * Utility class for managing a shader uniform variable.
     */
    var ShaderUniformVariable = (function () {
        function ShaderUniformVariable(name, type) {
            this.name = name;
            this.type = type;
            switch (type) {
                case 'mat3':
                case 'mat4':
                    {
                    }
                    break;
                default: {
                    throw new Error("Illegal argument type: " + type);
                }
            }
        }
        ShaderUniformVariable.prototype.contextGain = function (context, program) {
            this.location = context.getUniformLocation(program, this.name);
        };
        ShaderUniformVariable.prototype.matrix = function (context, transpose, matrix) {
            switch (this.type) {
                case 'mat3':
                    {
                        context.uniformMatrix3fv(this.location, transpose, matrix);
                    }
                    break;
                case 'mat4':
                    {
                        context.uniformMatrix4fv(this.location, transpose, matrix);
                    }
                    break;
                default: {
                    throw new Error("Illegal argument type: " + this.type);
                }
            }
        };
        ShaderUniformVariable.prototype.toString = function () {
            return [this.type, this.name].join(' ');
        };
        return ShaderUniformVariable;
    })();
    return ShaderUniformVariable;
});
