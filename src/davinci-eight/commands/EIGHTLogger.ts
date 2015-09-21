import core = require('../core');
import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import Shareable = require('../utils/Shareable');

/**
 * <p>
 * Displays details about EIGHT to the console.
 * <p> 
 * @class EIGHTLogger
 * @extends Shareable
 * @implements IContextCommand
 */
class EIGHTLogger extends Shareable implements IContextCommand {
  /**
   * <p>
   * Initializes <b>the</b> `type` property to 'EIGHTLogger'.
   * </p>
   * @class EIGHTLogger
   * @constructor
   */
  constructor() {
    super('EIGHTLogger');
  }
  /**
   * Logs the version, GitHub URL, and last modified date to the console. 
   * @method execute
   * @param unused WebGLRenderingContext
   */
  execute(unused: WebGLRenderingContext): void {
    console.log(core.NAMESPACE + " " + core.VERSION + " (" + core.GITHUB + ") " + core.LAST_MODIFIED);
  }
  /**
   * Does nothing.
   * @protected
   * @method destructor
   * @return void
   */
  protected destructor(): void {
  }
}

export = EIGHTLogger;