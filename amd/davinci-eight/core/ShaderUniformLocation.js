define(["require", "exports"], function (require, exports) {
    /**
     * Returns the corresponding bind point for a given sampler type
     */
    function getBindPointForSamplerType(gl, type) {
        if (type === gl.SAMPLER_2D)
            return gl.TEXTURE_2D;
        if (type === gl.SAMPLER_CUBE)
            return gl.TEXTURE_CUBE_MAP;
    }
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
         * @param contextId {string}
         */
        ShaderUniformLocation.prototype.contextGain = function (context, program, contextId) {
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
        ShaderUniformLocation.prototype.createSetter = function (gl, uniformInfo) {
            var uniformLoc = this;
            var name = uniformInfo.name;
            var size = uniformInfo.size;
            var type = uniformInfo.type;
            var isArray = (size > 1 && name.substr(-3) === "[0]");
            if (type === gl.FLOAT && isArray) {
                return function (data) {
                    uniformLoc.uniform1fv(data.vector);
                };
            }
            if (type === gl.FLOAT) {
                return function (data) {
                    uniformLoc.uniform1f(data.x);
                };
            }
            if (type === gl.FLOAT_VEC2) {
                return function (data) {
                    uniformLoc.uniform2fv(data.vector);
                };
            }
            if (type === gl.FLOAT_VEC3) {
                return function (data) {
                    uniformLoc.uniform3fv(data.vector);
                };
            }
            if (type === gl.FLOAT_VEC4) {
                return function (data) {
                    uniformLoc.uniform4fv(data.vector);
                };
            }
            /*
            if (type === gl.INT && isArray) {
              return function(data: UniformDataInfo) {
                gl.uniform1iv(location, data.uniformZs);
              };
            }
            if (type === gl.INT) {
              return function(data: UniformDataInfo) {
                gl.uniform1i(location, data.x);
              };
            }
            if (type === gl.INT_VEC2) {
              return function(data: UniformDataInfo) {
                gl.uniform2iv(location, data.uniformZs);
              };
            }
            if (type === gl.INT_VEC3) {
              return function(data: UniformDataInfo) {
                gl.uniform3iv(location, data.uniformZs);
              };
            }
            if (type === gl.INT_VEC4) {
              return function(data: UniformDataInfo) {
                gl.uniform4iv(location, data.uniformZs);
              };
            }
            if (type === gl.BOOL) {
              return function(data: UniformDataInfo) {
                gl.uniform1iv(location, data.uniformZs);
              };
            }
            if (type === gl.BOOL_VEC2) {
              return function(data: UniformDataInfo) {
                gl.uniform2iv(location, data.uniformZs);
              };
            }
            if (type === gl.BOOL_VEC3) {
              return function(data: UniformDataInfo) {
                gl.uniform3iv(location, data.uniformZs);
              };
            }
            if (type === gl.BOOL_VEC4) {
              return function(data: UniformDataInfo) {
                gl.uniform4iv(location, data.uniformZs);
              };
            }
            */
            if (type === gl.FLOAT_MAT2) {
                return function (data) {
                    uniformLoc.uniformMatrix2fv(data.transpose, data.matrix2);
                };
            }
            if (type === gl.FLOAT_MAT3) {
                return function (data) {
                    uniformLoc.uniformMatrix3fv(data.transpose, data.matrix3);
                };
            }
            if (type === gl.FLOAT_MAT4) {
                return function (data) {
                    uniformLoc.uniformMatrix4fv(data.transpose, data.matrix4);
                };
            }
            /*
            if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
              var units: number[] = [];
              for (var ii = 0; ii < uniformInfo.size; ++ii) { // BUG fixed info
                units.push(textureUnit++);
              }
              return function(bindPoint, units) {
                return function(textures) {
                  gl.uniform1iv(location, units);
                  textures.forEach(function(texture, index) {
                    gl.activeTexture(gl.TEXTURE0 + units[index]);
                    gl.bindTexture(bindPoint, texture);
                  });
                };
              }(getBindPointForSamplerType(gl, type), units);
            }
            if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
              return function(bindPoint, unit) {
                return function(texture) {
                  gl.uniform1i(location, unit);
                  gl.activeTexture(gl.TEXTURE0 + unit);
                  gl.bindTexture(bindPoint, texture);
                };
              }(getBindPointForSamplerType(gl, type), textureUnit++);
            }
            */
            throw ("unknown type: 0x" + type.toString(16)); // we should never get here.
        };
        /**
         * @method uniform1f
         * @param value {number} Value to assign.
         */
        ShaderUniformLocation.prototype.uniform1f = function (value) {
            this.context.uniform1f(this.location, value);
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
         * @method uniform3fv
         * @param data {number[]}
         */
        ShaderUniformLocation.prototype.uniform3fv = function (data) {
            this.context.uniform3fv(this.location, data);
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
         * @method uniformMatrix2fv
         * @param transpose {boolean}
         * @param matrix {Float32Array}
         */
        ShaderUniformLocation.prototype.uniformMatrix2fv = function (transpose, matrix) {
            if (!(matrix instanceof Float32Array)) {
                throw new Error("matrix must be a Float32Array.");
            }
            this.context.uniformMatrix2fv(this.location, transpose, matrix);
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
    return ShaderUniformLocation;
});
