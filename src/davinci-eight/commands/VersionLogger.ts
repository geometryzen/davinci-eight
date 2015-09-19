import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import Shareable = require('../utils/Shareable');

/**
 * <p>
 * Displays details about the WegGL version to the console.
 * <p> 
 * @class VersionLogger
 * @extends Shareable
 * @implements IContextCommand
 */
class VersionLogger extends Shareable implements IContextCommand {
  constructor() {
    super('VersionLogger');
  }
  execute(gl: WebGLRenderingContext): void {
    console.log(gl.getParameter(gl.VERSION));
  }
  destructor(): void {
  }
}

export = VersionLogger;