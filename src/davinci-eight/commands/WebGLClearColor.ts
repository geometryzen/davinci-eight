import ContextListener = require('../core/ContextListener');
import ContextManager = require('../core/ContextManager');
import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import Shareable = require('../utils/Shareable');

/**
 * <p>
 * clearColor(red: number, green: number, blue: number, alpha: number): void
 * <p> 
 * @class WebGLClearColor
 * @extends Shareable
 * @implements IContextCommand
 * @implements ContextListener
 */
class WebGLClearColor extends Shareable implements IContextCommand, ContextListener {
  public red: number;
  public green: number;
  public blue: number;
  public alpha: number;
  /**
   * @class WebGLClearColor
   * @constructor
   */
  constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 1) {
    super('WebGLClearColor');
    this.red   = mustBeNumber('red',   red);
    this.green = mustBeNumber('green', green);
    this.blue  = mustBeNumber('blue',  blue);
    this.alpha = mustBeNumber('alpha', alpha);
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
    mustBeNumber('red', this.red);
    mustBeNumber('green', this.green);
    mustBeNumber('blue', this.blue);
    mustBeNumber('alpha', this.alpha);
    gl.clearColor(this.red, this.green, this.blue, this.alpha);
  }
  /**
   * @method destructor
   * @return {void}
   */
  destructor(): void {
    this.red = void 0;
    this.green = void 0;
    this.blue = void 0;
    this.alpha = void 0;
  }
}

export = WebGLClearColor;