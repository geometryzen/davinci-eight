import core from '../core';
import ContextProvider from '../core/ContextProvider';
import ShareableBase from '../core/ShareableBase';

/**
 * <p>
 * Displays details about EIGHT to the console.
 * <p> 
 * @class EIGHTLogger
 * @extends ShareableBase
 */
export default class EIGHTLogger extends ShareableBase {
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
    contextFree(manager: ContextProvider): void {
        // Do nothing.
    }
    /**
     * Logs the version, GitHub URL, and last modified date to the console. 
     * @method execute
     * @param unused WebGLRenderingContext
     */
    contextGain(manager: ContextProvider): void {
        console.log(`${core.NAMESPACE} ${core.VERSION} (${core.GITHUB}) ${core.LAST_MODIFIED}`);
    }
    contextLost(): void {
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
        return this._type;
    }
}
