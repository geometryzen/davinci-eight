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
    /**
     * <p>
     * Initializes <b>the</b> `type` property to 'EIGHTLogger'.
     * </p>
     * @class EIGHTLogger
     * @constructor
     */
    constructor();
    /**
     * Logs the version, GitHub URL, and last modified date to the console.
     * @method execute
     * @param unused WebGLRenderingContext
     */
    execute(unused: WebGLRenderingContext): void;
    /**
     * Does nothing.
     * @protected
     * @method destructor
     * @return void
     */
    protected destructor(): void;
    name: string;
}
export = EIGHTLogger;
