import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import mustBeString = require('../checks/mustBeString');
import Shareable = require('../utils/Shareable');

var factors = [
  'ZERO',
  'ONE',
  'SRC_COLOR',
  'ONE_MINUS_SRC_COLOR',
  'DST_COLOR',
  'ONE_MINUS_DST_COLOR',
  'SRC_ALPHA',
  'ONE_MINUS_SRC_ALPHA',
  'DST_ALPHA',
  'ONE_MINUS_DST_ALPHA',
  'SRC_ALPHA_SATURATE'
]

function mustBeFactor(name: string, factor: string): string {
  if (factors.indexOf(factor) >= 0) {
    return factor;
  }
  else {
    throw new Error(factor + " is not a valid factor. Factor must be one of " + JSON.stringify(factors))
  }
}

/**
 * @class WebGLBlendFunc
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
class WebGLBlendFunc extends Shareable implements IContextCommand {
  public sfactor: string;
  public dfactor: string;
  /**
   * @class WebGLBlendFunc
   * @constructor
   * @param sfactor {string}
   * @param dfactor {string}
   */
  constructor(sfactor: string, dfactor: string) {
    super('WebGLBlendFunc')
    this.sfactor = mustBeFactor('sfactor', sfactor)
    this.dfactor = mustBeFactor('dfactor', dfactor)
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
    this.execute(manager.gl)
  }
  /**
   * @method contextLost
   * @param canvasId {number}
   * @return {void}
   */
  contextLost(canvasId: number): void {
    // do nothing
  }
  private execute(gl: WebGLRenderingContext): void {
    var sfactor = mustBeNumber('sfactor => ' + this.sfactor, <number>((<any>gl)[this.sfactor]))
    var dfactor = mustBeNumber('dfactor => ' + this.dfactor, <number>((<any>gl)[this.dfactor]))
    gl.blendFunc(sfactor, dfactor)
  }
  /**
   * @method destructor
   * @return {void}
   */
  destructor(): void {
    this.sfactor = void 0
    this.dfactor = void 0
  }
}

export = WebGLBlendFunc;