import AttribDataInfo = require('../core/AttribDataInfo');
import AttribProvider = require('../core/AttribProvider');
import convertUsage = require('../core/convertUsage');
import DataUsage = require('../core/DataUsage');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');
import ShaderAttribSetter = require('../core/ShaderAttribSetter');

function existsLocation(location: number): boolean {
  return location >= 0;
}

/**
 * Utility class for managing a shader attribute variable.
 * While this class may be created directly by the user, it is preferable
 * to use the ShaderAttribLocation instances managed by the ShaderProgram because
 * there will be improved integrity and context loss management.
 * @class ShaderAttribLocation.
 */
class ShaderAttribLocation implements RenderingContextProgramUser {
  /**
   * @property name {string} The name of the variable as it appears in the GLSL program. 
   */
  public name: string;
  /**
   * Index of target attribute in the buffer.
   */
  private location: number;
  private _context: WebGLRenderingContext;
  /**
   * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
   * In particular, this class manages buffer allocation, location caching, and data binding.
   * @class ShaderAttribLocation
   * @constructor
   * @param name {string} The name of the variable as it appears in the GLSL program.
   * @param size {number} The size of the variable as it appears in the GLSL program.
   * @param type {number} The type of the variable as it appears in the GLSL program.
   */
  constructor(name: string, size: number, type: number) {
    this.name = name;
  }
  contextFree() {
    this.location = void 0;
    this._context = void 0;
  }
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    if (this._context !== context) {
      this.location = context.getAttribLocation(program, this.name);
      this._context = context;
    }
  }
  contextLoss() {
    this.location = void 0;
    this._context = void 0;
  }
  /**
   * @method vertexAttribPointer
   * @param numComponents {number} The number of components per attribute. Must be 1,2,3, or 4.
   * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
   */
  vertexAttribPointer(numComponents: number, normalized: boolean = false, stride: number = 0, offset: number = 0) {
    if (this._context) {
      this._context.vertexAttribPointer(this.location, numComponents, this._context.FLOAT, normalized, stride, offset);
    }
    else {
      console.warn("ShaderAttribLocation.vertexAttribPointer() missing WebGLRenderingContext");
    }
  }
  enable() {
    if (this._context) {
      this._context.enableVertexAttribArray(this.location);
    }
    else {
      console.warn("ShaderAttribLocation.enable() missing WebGLRenderingContext");
    }
  }
  disable() {
    if (this._context) {
      this._context.disableVertexAttribArray(this.location);
    }
    else {
      console.warn("ShaderAttribLocation.disable() missing WebGLRenderingContext");
    }
  }
  /**
   * @method toString
   */
  toString(): string {
    return ["ShaderAttribLocation(", this.name, ")"].join('');
  }
}

export = ShaderAttribLocation;
