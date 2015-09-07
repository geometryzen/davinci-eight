import AttribDataInfo = require('../core/AttribDataInfo');
import AttribProvider = require('../core/AttribProvider');
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
  private _location: number;
  private _context: WebGLRenderingContext;
  private _enabled: boolean = void 0;
  /**
   * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
   * In particular, this class manages buffer allocation, location caching, and data binding.
   * @class AttribLocation
   * @constructor
   * @param name {string} The name of the variable as it appears in the GLSL program.
   */
  constructor(name: string) {
    this._name = expectArg('name', name).toBeString().value;
  }
  contextFree(): void {
    this.contextLoss();
  }
  contextGain(context: WebGLRenderingContext, program: WebGLProgram): void {
    this.contextLoss();
    this._location = context.getAttribLocation(program, this._name);
    this._context  = context;
  }
  contextLoss(): void {
    this._location = void 0;
    this._context  = void 0;
    this._enabled  = void 0;
  }
  /**
   * @method vertexPointer
   * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
   * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
   */
  vertexPointer(size: number, normalized: boolean = false, stride: number = 0, offset: number = 0): void {
    this._context.vertexAttribPointer(this._location, size, this._context.FLOAT, normalized, stride, offset);
  }
  enable(): void {
    if (this._enabled !== true) {
      this._context.enableVertexAttribArray(this._location);
      this._enabled = true;
    }
  }
  disable(): void {
    if (this._enabled !== false) {
      this._context.disableVertexAttribArray(this._location);
      this._enabled = false;
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
