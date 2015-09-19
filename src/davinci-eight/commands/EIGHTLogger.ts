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
  constructor() {
    super('EIGHTLogger');
  }
  execute(unused: WebGLRenderingContext): void {
    console.log(core.NAMESPACE + " " + core.VERSION + " (" + core.GITHUB + ") " + core.LAST_MODIFIED);
  }
  destructor(): void {
  }
}

export = EIGHTLogger;