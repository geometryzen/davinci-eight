import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import mustBeString = require('../checks/mustBeString');
import Shareable = require('../utils/Shareable');

/**
 * <p>
 * disable(capability: string): void
 * <p> 
 * @class WebGLDisable
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
class WebGLDisable extends Shareable implements IContextCommand, IContextConsumer {
  private _capability: string;
  /**
   * @class WebGLDisable
   * @constructor
   * @param capability {string} The name of the WebGLRenderingContext property to be disabled.
   */
  constructor(capability: string) {
    super('WebGLDisable')
    this._capability = mustBeString('capability', capability)
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
    manager.gl.disable(mustBeNumber(this._capability, <number>((<any>manager.gl)[this._capability])))
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
   * @protected
   */
  protected destructor(): void {
    this._capability = void 0
    super.destructor()
  }
}

export = WebGLDisable