import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * Displays details about EIGHT to the console.
 * <p>
 * @class EIGHTLogger
 * @extends Shareable
 * @implements IContextCommand
 */
declare class EIGHTLogger extends Shareable implements IContextCommand {
    constructor();
    execute(unused: WebGLRenderingContext): void;
    destructor(): void;
}
export = EIGHTLogger;
