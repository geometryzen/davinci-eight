import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * Displays details about the WegGL version to the console.
 * <p>
 * @class VersionLogger
 * @extends Shareable
 * @implements IContextCommand
 */
declare class VersionLogger extends Shareable implements IContextCommand {
    constructor();
    execute(gl: WebGLRenderingContext): void;
    destructor(): void;
}
export = VersionLogger;
