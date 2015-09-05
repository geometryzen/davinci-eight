import AttribDataInfo = require('../core/AttribDataInfo');
import AttribProvider = require('../core/AttribProvider');
import convertUsage = require('../core/convertUsage');
import DataUsage = require('../core/DataUsage');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');

function existsLocation(location: number): boolean {
  return location >= 0;
}

/**
 * Utility class for managing a shader attribute variable.
 * While this class may be created directly by the user, it is preferable
 * to use the AttribLocation instances managed by the ShaderProgram because
 * there will be improved integrity and context loss management.
 * @class AttribLocation.
 */
class AttribLocation implements RenderingContextProgramUser {
  private _name: string;
  private _size: number;
  private _type: number;
  private _location: number;
  private _context: WebGLRenderingContext;
  /**
   * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
   * In particular, this class manages buffer allocation, location caching, and data binding.
   * @class AttribLocation
   * @constructor
   * @param name {string} The name of the variable as it appears in the GLSL program.
   * @param size {number} The size of the variable as it appears in the GLSL program.
   * @param type {number} The type of the variable as it appears in the GLSL program.
   */
  constructor(name: string, size: number, type: number) {
    this._name = expectArg('name', name).toBeString().value;
    this._size = expectArg('size', size).toBeNumber().value;
    this._type = expectArg('type', type).toBeNumber().value;
  }
  contextFree(): void {
    this._location = void 0;
    this._context = void 0;
  }
  contextGain(context: WebGLRenderingContext, program: WebGLProgram): void {
    if (this._context !== context) {
      this._location = context.getAttribLocation(program, this._name);
      this._context = context;
    }
  }
  contextLoss(): void {
    this._location = void 0;
    this._context = void 0;
  }
  /**
   * @method vertexPointer
   * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
   * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
   */
  vertexPointer(size: number, normalized: boolean = false, stride: number = 0, offset: number = 0): void {
    if (this._context) {
      return this._context.vertexAttribPointer(this._location, size, this._context.FLOAT, normalized, stride, offset);
    }
    else {
      console.warn("AttribLocation.vertexAttribPointer() missing WebGLRenderingContext");
    }
  }
  enable(): void {
    if (this._context) {
      return this._context.enableVertexAttribArray(this._location);
    }
    else {
      console.warn("AttribLocation.enable() missing WebGLRenderingContext");
    }
  }
  disable(): void {
    if (this._context) {
      return this._context.disableVertexAttribArray(this._location);
    }
    else {
      console.warn("AttribLocation.disable() missing WebGLRenderingContext");
    }
  }
  /**
   * @method toString
   */
  toString(): string {
    return ['attribute', this._name].join(' ');
  }
}

export = AttribLocation;
