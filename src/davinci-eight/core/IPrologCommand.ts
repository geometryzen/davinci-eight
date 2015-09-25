import IContextProvider = require('../core/IContextProvider')
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
   * @param manager {IContextProvider}
   * @return {void}
   */
  execute(manager: IContextProvider): void;
}

export = IPrologCommand;