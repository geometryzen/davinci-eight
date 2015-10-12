import IContextConsumer = require('../core/IContextConsumer')
import IContextCommand = require('../core/IContextCommand')
import IPrologCommand = require('../core/IPrologCommand')
import IDrawList = require('../scene/IDrawList')
import IUnknown = require('../core/IUnknown')
import IFacet = require('../core/IFacet') 
/**
 * This interface is to be implemented by classes associated with a single context.
 * This does mean that the commands are not shared.
 * @class ContextRenderer
 * @extends IContextConsumer
 * @extends IUnknown
 */
interface ContextRenderer extends IContextConsumer, IUnknown {
  /**
   * The (readonly) cached WebGL rendering context. The context may sometimes be undefined.
   * @property gl
   * @type {WebGLRenderingContext}
   * @readOnly
   */
  gl: WebGLRenderingContext;
  /**
   * @property canvas
   * @type {HTMLCanvasElement}
   * @readOnly
   */
  canvas: HTMLCanvasElement;
  /**
   * <p>
   * Determines whether the prolog commands are run automatically as part of the render method.
   * </p>
   * @property autoProlog
   * @type {boolean}
   */
  autoProlog: boolean;
  /**
   * Executes the prolog commands.
   * @method prolog
   * @return {void}
   */
  prolog(): void;
  /**
   * Adds a command to the `prolog` that will be executed as part of the render() call, before drawing.
   * The method is chainable on the command added.
   * @method addPrologCommand
   * @param command {IPrologCommand}
   * @return {IPrologCommand}
   * @chainable
   */
  addPrologCommand(command: IPrologCommand): IPrologCommand;
  /**
   * Adds a handler that will be executed for context free, gain, and loss events. 
   * @method addContextGainCommand
   * @param command {IContextCommand}
   * @return {IContextCommand}
   * @chainable
   */
  addContextGainCommand(command: IContextCommand): IContextCommand;
}

export = ContextRenderer;