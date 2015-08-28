import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import UniformProvider = require('../core/UniformProvider');
// TODO: Determine the type earlier to avoid the switch.
function updateUniform(uniformLocation: ShaderUniformLocation, provider: UniformProvider) {
  switch(uniformLocation.glslType) {
    case 'float': {
      let data: number = provider.getUniformFloat(uniformLocation.name);
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
    case 'vec2': {
      let data: number[] = provider.getUniformVector2(uniformLocation.name);
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
    case 'vec3': {
      let data: number[] = provider.getUniformVector3(uniformLocation.name);
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
    case 'vec4': {
      let data: number[] = provider.getUniformVector4(uniformLocation.name);
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
    case 'mat3': {
      let data = provider.getUniformMatrix3(uniformLocation.name);
      if (data) {
        uniformLocation.uniformMatrix3fv(data.transpose, data.matrix3);
      }
      else {
        throw new Error("Expecting data for uniform " + uniformLocation.name);
      }
    }
    break;
    case 'mat4': {
      let data = provider.getUniformMatrix4(uniformLocation.name);
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

export = updateUniform;
