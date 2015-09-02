import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');
import UniformDataInfo = require('../core/UniformDataInfo');
import ShaderUniformSetter = require('../core/ShaderUniformSetter');

/**
 * Returns the corresponding bind point for a given sampler type
 */
function getBindPointForSamplerType(gl: WebGLRenderingContext, type: number) {
  if (type === gl.SAMPLER_2D)   return gl.TEXTURE_2D;
  if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;
}

/**
 * Utility class for managing a shader uniform variable.
 * @class ShaderUniformLocation
 */
class ShaderUniformLocation implements RenderingContextProgramUser {
  public name: string;
  private context: WebGLRenderingContext;
  private location: WebGLUniformLocation;
  /**
   * @class ShaderUniformLocation
   * @constructor
   * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
   */
  constructor(name: string) {
    this.name = name;
  }
  /**
   * @method contextFree
   */
  contextFree() {
    this.location = void 0;
    this.context = void 0;
  }
  /**
   * @method contextGain
   * @param context {WebGLRenderingContext}
   * @param program {WebGLProgram}
   */
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    if (this.context !== context) {
      this.location = context.getUniformLocation(program, this.name);
      this.context = context;
    }
  }
  /**
   * @method contextLoss
   */
  contextLoss() {
    this.location = void 0;
    this.context = void 0;
  }
  createSetter(gl: WebGLRenderingContext, uniformInfo: WebGLActiveInfo): ShaderUniformSetter {
    let uniformLoc = this;
    let name = uniformInfo.name;
    let size = uniformInfo.size;
    let type = uniformInfo.type;
    let isArray = (size > 1 && name.substr(-3) === "[0]");
    if (type === gl.FLOAT && isArray) {
      return function(data: UniformDataInfo) {
        uniformLoc.uniform1fv(data.vector);
      };
    }
    if (type === gl.FLOAT) {
      return function(data: UniformDataInfo) {
        uniformLoc.uniform1f(data.x);
      };
    }
    if (type === gl.FLOAT_VEC2) {
      return function(data: UniformDataInfo) {
        uniformLoc.uniform2fv(data.vector);
      };
    }
    if (type === gl.FLOAT_VEC3) {
      return function(data: UniformDataInfo) {
        uniformLoc.uniform3fv(data.vector);
      };
    }
    if (type === gl.FLOAT_VEC4) {
      return function(data: UniformDataInfo) {
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
      return function(data: UniformDataInfo) {
        uniformLoc.uniformMatrix2fv(data.transpose, data.matrix2);
      };
    }
    if (type === gl.FLOAT_MAT3) {
      return function(data: UniformDataInfo) {
        uniformLoc.uniformMatrix3fv(data.transpose, data.matrix3);
      };
    }
    if (type === gl.FLOAT_MAT4) {
      return function(data: UniformDataInfo) {
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
  }
  /**
   * @method uniform1f
   * @param x {number} Value to assign.
   */
  uniform1f(x: number) {
    this.context.uniform1f(this.location, x);
  }
  /**
   * @method uniform1fv
   * @param data {number[]}
   */
  uniform1fv(data: number[]) {
    this.context.uniform1fv(this.location, data);
  }
  /**
   * @method uniform2f
   * @param x {number} Horizontal value to assign.
   * @param y {number} Vertical number to assign.
   */
  uniform2f(x: number, y: number) {
    this.context.uniform2f(this.location, x, y);
  }
  /**
   * @method uniform2fv
   * @param data {number[]}
   */
  uniform2fv(data: number[]) {
    this.context.uniform2fv(this.location, data);
  }
  /**
   * @method uniform3f
   * @param x {number} Horizontal value to assign.
   * @param y {number} Vertical number to assign.
   * @param z {number}
   */
  uniform3f(x: number, y: number, z: number) {
    this.context.uniform3f(this.location, x, y, z);
  }
  /**
   * @method uniform3fv
   * @param data {number[]}
   */
  uniform3fv(data: number[]) {
    this.context.uniform3fv(this.location, data);
  }
  /**
   * @method uniform3f
   * @param x {number} Horizontal value to assign.
   * @param y {number} Vertical number to assign.
   * @param z {number}
   * @param w {number}
   */
  uniform4f(x: number, y: number, z: number, w: number) {
    this.context.uniform4f(this.location, x, y, z, w);
  }
  /**
   * @method uniform4fv
   * @param data {number[]}
   */
  uniform4fv(data: number[]) {
    this.context.uniform4fv(this.location, data);
  }
  /**
   * @method uniformMatrix2fv
   * @param transpose {boolean}
   * @param matrix {Float32Array}
   */
  uniformMatrix2fv(transpose: boolean, matrix: Float32Array) {
    if (!(matrix instanceof Float32Array)) {
      throw new Error("matrix must be a Float32Array.");
    }
    this.context.uniformMatrix2fv(this.location, transpose, matrix);
  }
  /**
   * @method uniformMatrix3fv
   * @param transpose {boolean}
   * @param matrix {Float32Array}
   */
  uniformMatrix3fv(transpose: boolean, matrix: Float32Array) {
    if (!(matrix instanceof Float32Array)) {
      throw new Error("matrix must be a Float32Array.");
    }
    this.context.uniformMatrix3fv(this.location, transpose, matrix);
  }
  /**
   * @method uniformMatrix4fv
   * @param transpose {boolean}
   * @param matrix {Float32Array}
   */
  uniformMatrix4fv(transpose: boolean, matrix: Float32Array) {
    if (!(matrix instanceof Float32Array)) {
      throw new Error("matrix must be a Float32Array.");
    }
    this.context.uniformMatrix4fv(this.location, transpose, matrix);
  }
  /**
   * @method toString
   */
  toString(): string {
    return ["ShaderUniformLocation(", this.name, ")"].join('');
  }
}

export = ShaderUniformLocation;
