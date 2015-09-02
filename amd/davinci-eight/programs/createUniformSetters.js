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
    function createUniformSetters(gl, program) {
        var textureUnit = 0;
        /**
         * Creates a setter for a uniform of the given program with it's
         * location embedded in the setter.
         * @param {WebGLProgram} program
         * @param {WebGLUniformInfo} uniformInfo
         * @returns {function} the created setter.
         */
        function createUniformSetter(program, uniformInfo) {
            var name = uniformInfo.name;
            var type = uniformInfo.type;
            var location = gl.getUniformLocation(program, name);
            // Check if this uniform is an array
            var isArray = (uniformInfo.size > 1 && name.substr(-3) === "[0]");
            if (type === gl.FLOAT && isArray) {
                return function (data) {
                    gl.uniform1fv(location, data);
                };
            }
            if (type === gl.FLOAT) {
                return function (data) {
                    gl.uniform1f(location, data.x);
                };
            }
            if (type === gl.FLOAT_VEC2) {
                return function (data) {
                    gl.uniform2fv(location, data.vector);
                };
            }
            if (type === gl.FLOAT_VEC3) {
                return function (data) {
                    gl.uniform3fv(location, data.vector);
                };
            }
            if (type === gl.FLOAT_VEC4) {
                return function (data) {
                    gl.uniform4fv(location, data.vector);
                };
            }
            if (type === gl.INT && isArray) {
                return function (data) {
                    gl.uniform1iv(location, data.uniformZs);
                };
            }
            if (type === gl.INT) {
                return function (data) {
                    gl.uniform1i(location, data.x);
                };
            }
            if (type === gl.INT_VEC2) {
                return function (data) {
                    gl.uniform2iv(location, data.uniformZs);
                };
            }
            if (type === gl.INT_VEC3) {
                return function (data) {
                    gl.uniform3iv(location, data.uniformZs);
                };
            }
            if (type === gl.INT_VEC4) {
                return function (data) {
                    gl.uniform4iv(location, data.uniformZs);
                };
            }
            if (type === gl.BOOL) {
                return function (data) {
                    gl.uniform1iv(location, data.uniformZs);
                };
            }
            if (type === gl.BOOL_VEC2) {
                return function (data) {
                    gl.uniform2iv(location, data.uniformZs);
                };
            }
            if (type === gl.BOOL_VEC3) {
                return function (data) {
                    gl.uniform3iv(location, data.uniformZs);
                };
            }
            if (type === gl.BOOL_VEC4) {
                return function (data) {
                    gl.uniform4iv(location, data.uniformZs);
                };
            }
            if (type === gl.FLOAT_MAT2) {
                return function (data) {
                    gl.uniformMatrix2fv(location, data.transpose, data.matrix2);
                };
            }
            if (type === gl.FLOAT_MAT3) {
                return function (data) {
                    gl.uniformMatrix3fv(location, data.transpose, data.matrix3);
                };
            }
            if (type === gl.FLOAT_MAT4) {
                return function (data) {
                    gl.uniformMatrix4fv(location, data.transpose, data.matrix4);
                };
            }
            if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
                var units = [];
                for (var ii = 0; ii < uniformInfo.size; ++ii) {
                    units.push(textureUnit++);
                }
                return function (bindPoint, units) {
                    return function (textures) {
                        gl.uniform1iv(location, units);
                        textures.forEach(function (texture, index) {
                            gl.activeTexture(gl.TEXTURE0 + units[index]);
                            gl.bindTexture(bindPoint, texture); // BUG fixed tetxure
                        });
                    };
                }(getBindPointForSamplerType(gl, type), units);
            }
            if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
                return function (bindPoint, unit) {
                    return function (texture) {
                        gl.uniform1i(location, unit);
                        gl.activeTexture(gl.TEXTURE0 + unit);
                        gl.bindTexture(bindPoint, texture);
                    };
                }(getBindPointForSamplerType(gl, type), textureUnit++);
            }
            throw ("unknown type: 0x" + type.toString(16)); // we should never get here.
        }
        var uniformSetters = {};
        var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (var ii = 0; ii < numUniforms; ++ii) {
            var uniformInfo = gl.getActiveUniform(program, ii);
            if (!uniformInfo) {
                break;
            }
            var name = uniformInfo.name;
            // remove the array suffix.
            if (name.substr(-3) === "[0]") {
                name = name.substr(0, name.length - 3);
            }
            var setter = createUniformSetter(program, uniformInfo);
            uniformSetters[name] = setter;
        }
        return uniformSetters;
    }
    return createUniformSetters;
});
