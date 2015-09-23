import ContextManager = require('../core/ContextManager')
import IUnknown = require('../core/IUnknown')

/**
 * The interface to be satisfied by commands run in the prolog phase of the animation loop.
 * @class IPrologCommand
 * @extends IUnknown
 */
interface IPrologCommand extends IUnknown {
  /**
   * <p>
   * The unique name of the command.
   * </p>
   * @property name
   * @type {string}
   * @readOnly
   */
  name: string;
  /**
   * @method execute
   * @param manager {ContextManager}
   * @return {void}
   */
  execute(manager: ContextManager): void;
}

export = IPrologCommand;