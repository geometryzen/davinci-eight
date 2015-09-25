import IContextProvider = require('../core/IContextProvider')
import IPrologCommand = require('../core/IPrologCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import Shareable = require('../utils/Shareable');

var QUALIFIED_NAME = 'WebGLRenderingContext.clear'

/**
 * <p>
 * clear(mask: number): void
 * <p> 
 * @class WebGLClear
 * @extends Shareable
 * @implements IContextCommand
 */
class WebGLClear extends Shareable implements IPrologCommand {
  /**
   * The mask used to specify which buffers to clear.
   * @property mask
   * @type {number}
   */
  public mask: number;
  /**
   * @class WebGLClear
   * @constructor
   */
  constructor(mask: number) {
    super(QUALIFIED_NAME);
    this.mask = mustBeNumber('mask', mask);
  }
  /**
   * @method destructor
   * @return {void}
   */
  destructor(): void {
      this.mask = void 0;
  }
  /**
   * @method execute
   * @param gl {WebGLRenderingContext}
   * @return {void}
   */
  execute(manager: IContextProvider): void {
    manager.gl.clear(this.mask);
  }
  /**
   * @property name
   * @type {string}
   * @readOnly
   */
  get name(): string {
    return QUALIFIED_NAME;
  }
}

export = WebGLClear;