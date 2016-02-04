import core from '../core';
import IContextCommand from '../core/IContextCommand';
import IContextProvider from '../core/IContextProvider';
import Shareable from '../utils/Shareable';

var QUALIFIED_NAME = 'EIGHT.Logger'

/**
 * <p>
 * Displays details about EIGHT to the console.
 * <p> 
 * @class EIGHTLogger
 * @extends Shareable
 * @implements IContextCommand
 */
export default class EIGHTLogger extends Shareable implements IContextCommand {
    /**
     * <p>
     * Initializes <b>the</b> `type` property to 'EIGHTLogger'.
     * </p>
     * @class EIGHTLogger
     * @constructor
     */
    constructor() {
        super(QUALIFIED_NAME);
    }
    contextFree(manager: IContextProvider): void {
        // Do nothing.
    }
    /**
     * Logs the version, GitHub URL, and last modified date to the console. 
     * @method execute
     * @param unused WebGLRenderingContext
     */
    contextGain(manager: IContextProvider): void {
        console.log(core.NAMESPACE + " " + core.VERSION + " (" + core.GITHUB + ") " + core.LAST_MODIFIED);
    }
    contextLost(canvasId: number): void {
        // Do nothing.
    }
    /**
     * Does nothing.
     * @protected
     * @method destructor
     * @return void
     */
    protected destructor(): void {
        // Do nothing.
    }
    get name(): string {
        return QUALIFIED_NAME;
    }
}
