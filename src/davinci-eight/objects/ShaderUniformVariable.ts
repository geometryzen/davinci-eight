/**
 * Utility class for manageing a shader uniform variable.
 */
class ShaderUniformVariable {
  public name: string;
  private location: WebGLUniformLocation;
  private type: string;
  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
    switch(type) {
      case 'mat3':
      case 'mat4': {
      }
      break;
      default: {
        throw new Error("Illegal argument type: " + type);
      }
    }
  }
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    this.location = context.getUniformLocation(program, this.name);
  }
  matrix(context: WebGLRenderingContext, transpose: boolean, matrix) {
    switch(this.type) {
      case 'mat3': {
          context.uniformMatrix3fv(this.location, transpose, matrix);
      }
      break;
      case 'mat4': {
          context.uniformMatrix4fv(this.location, transpose, matrix);
      }
      break;
      default: {
        throw new Error("Illegal argument type: " + this.type);
      }
    }
  }
  toString(): string {
    return [this.type, this.name].join(' ');
  }
}

export = ShaderUniformVariable;
