import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import Shareable = require('../utils/Shareable');

/**
 * <p>
 * clear(mask: number): void
 * <p> 
 * @class WebGLClear
 * @extends Shareable
 * @implements IContextCommand
 */
class WebGLClear extends Shareable implements IContextCommand {
  public mask: number;
  /**
   * @class WebGLClear
   * @constructor
   */
  constructor(mask: number) {
    super('WebGLClear');
    this.mask = mustBeNumber('mask', mask);
  }
  /**
   * @method execute
   * @param gl {WebGLRenderingContext}
   * @return {void}
   */
  execute(gl: WebGLRenderingContext): void {
    mustBeNumber('mask', this.mask);
    gl.clear(this.mask);
  }
  /**
   * @method destructor
   * @return {void}
   */
  destructor(): void {
    this.mask = void 0;
  }
}

export = WebGLClear;