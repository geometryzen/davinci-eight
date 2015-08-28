define(["require", "exports"], function (require, exports) {
    // TODO: Determine the type earlier to avoid the switch.
    function updateUniform(uniformLocation, provider) {
        switch (uniformLocation.glslType) {
            case 'float':
                {
                    var data = provider.getUniformFloat(uniformLocation.name);
                    if (typeof data !== 'undefined') {
                        if (typeof data === 'number') {
                            uniformLocation.uniform1f(data);
                        }
                        else {
                            throw new Error("Expecting typeof data for uniform float " + uniformLocation.name + " to be 'number'.");
                        }
                    }
                    else {
                        throw new Error("Expecting data for uniform float " + uniformLocation.name);
                    }
                }
                break;
            case 'vec2':
                {
                    var data = provider.getUniformVector2(uniformLocation.name);
                    if (data) {
                        if (data.length === 2) {
                            uniformLocation.uniform2fv(data);
                        }
                        else {
                            throw new Error("Expecting data for uniform vec2 " + uniformLocation.name + " to be number[] with length 2");
                        }
                    }
                    else {
                        throw new Error("Expecting data for uniform vec2 " + uniformLocation.name);
                    }
                }
                break;
            case 'vec3':
                {
                    var data = provider.getUniformVector3(uniformLocation.name);
                    if (data) {
                        if (data.length === 3) {
                            uniformLocation.uniform3fv(data);
                        }
                        else {
                            throw new Error("Expecting data for uniform " + uniformLocation.name + " to be number[] with length 3");
                        }
                    }
                    else {
                        throw new Error("Expecting data for uniform " + uniformLocation.name);
                    }
                }
                break;
            case 'vec4':
                {
                    var data = provider.getUniformVector4(uniformLocation.name);
                    if (data) {
                        if (data.length === 4) {
                            uniformLocation.uniform4fv(data);
                        }
                        else {
                            throw new Error("Expecting data for uniform " + uniformLocation.name + " to be number[] with length 4");
                        }
                    }
                    else {
                        throw new Error("Expecting data for uniform " + uniformLocation.name);
                    }
                }
                break;
            case 'mat3':
                {
                    var data = provider.getUniformMatrix3(uniformLocation.name);
                    if (data) {
                        uniformLocation.uniformMatrix3fv(data.transpose, data.matrix3);
                    }
                    else {
                        throw new Error("Expecting data for uniform " + uniformLocation.name);
                    }
                }
                break;
            case 'mat4':
                {
                    var data = provider.getUniformMatrix4(uniformLocation.name);
                    if (data) {
                        uniformLocation.uniformMatrix4fv(data.transpose, data.matrix4);
                    }
                    else {
                        throw new Error("Expecting data for uniform " + uniformLocation.name);
                    }
                }
                break;
            default: {
                throw new Error("Unexpected uniform GLSL type in primitive.draw: " + uniformLocation.glslType);
            }
        }
    }
    return updateUniform;
});
