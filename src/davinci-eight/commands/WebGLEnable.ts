import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import Shareable = require('../utils/Shareable');

var QUALIFIED_NAME = 'WebGLRenderingContext.enable'

/**
 * <p>
 * enable(capability: number): void
 * <p> 
 * @class WebGLEnable
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
class WebGLEnable extends Shareable implements IContextCommand, IContextConsumer {
  public capability: number;
  /**
   * @class WebGLEnable
   * @constructor
   */
  constructor(capability: number = 1) {
    super(QUALIFIED_NAME);
    this.capability = mustBeNumber('capability', capability);
  }
  /**
   * @method contextFree
   * @param canvasId {number}
   * @return {void}
   */
  contextFree(canvasId: number): void {
    // do nothing
  }
  /**
   * @method contextGain
   * @param manager {IContextProvider}
   * @return {void}
   */
  contextGain(manager: IContextProvider): void {
    this.execute(manager.gl);
  }
  /**
   * @method contextLost
   * @param canvasId {number}
   * @return {void}
   */
  contextLost(canvasId: number): void {
    // do nothing
  }
  /**
   * @method execute
   * @param gl {WebGLRenderingContext}
   * @return {void}
   */
  execute(gl: WebGLRenderingContext): void {
    mustBeNumber('capability', this.capability);
    gl.enable(this.capability);
  }
  /**
   * @method destructor
   * @return {void}
   */
  destructor(): void {
    this.capability = void 0;
  }
  get name(): string {
    return QUALIFIED_NAME;
  }
}

export = WebGLEnable;