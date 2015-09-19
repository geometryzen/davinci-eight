import ContextListener = require('../core/ContextListener');
import ContextManager = require('../core/ContextManager');
import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import Shareable = require('../utils/Shareable');

/**
 * <p>
 * enable(capability: number): void
 * <p> 
 * @class WebGLEnable
 * @extends Shareable
 * @implements IContextCommand
 * @implements ContextListener
 */
class WebGLEnable extends Shareable implements IContextCommand, ContextListener {
  public capability: number;
  /**
   * @class WebGLEnable
   * @constructor
   */
  constructor(capability: number = 1) {
    super('WebGLEnable');
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
   * @param manager {ContextManager}
   * @return {void}
   */
  contextGain(manager: ContextManager): void {
    this.execute(manager.gl);
  }
  /**
   * @method contextLoss
   * @param canvasId {number}
   * @return {void}
   */
  contextLoss(canvasId: number): void {
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
}

export = WebGLEnable;