import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
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
 * @implements IContextConsumer
 */
class WebGLClearColor extends Shareable implements IContextCommand {
  public red: number;
  public green: number;
  public blue: number;
  public alpha: number;
  /**
   * @class WebGLClearColor
   * @constructor
   */
  constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 1) {
    super('WebGLClearColor')
    this.red   = mustBeNumber('red',   red)
    this.green = mustBeNumber('green', green)
    this.blue  = mustBeNumber('blue',  blue)
    this.alpha = mustBeNumber('alpha', alpha)
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
    mustBeNumber('red', this.red)
    mustBeNumber('green', this.green)
    mustBeNumber('blue', this.blue)
    mustBeNumber('alpha', this.alpha)
    manager.gl.clearColor(this.red, this.green, this.blue, this.alpha)
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
   * @method destructor
   * @return {void}
   */
  destructor(): void {
    this.red = void 0
    this.green = void 0
    this.blue = void 0
    this.alpha = void 0
    super.destructor()
  }
}

export = WebGLClearColor;