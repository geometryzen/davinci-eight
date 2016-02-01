import IContextCommand from '../core/IContextCommand';
import IContextProvider from '../core/IContextProvider';
import Shareable from '../utils/Shareable';

let QUALIFIED_NAME = 'EIGHT.VersionLogger'

/**
 * @class VersionLogger
 * @extends Shareable
 * @implements IContextCommand
 */
export default class VersionLogger extends Shareable implements IContextCommand {
    /**
     * <p>
     * Displays details about the WegGL version to the console.
     * </p> 
     * <p>
     * Initializes the <code>type</code> property to <code>'VersionLogger'</code> for reference count tracking.
     * </p>
     * @class VersionLogger
     * @constructor
     */
    constructor() {
        super(QUALIFIED_NAME)
    }
    contextFree(canvasId?: number): void {
        // Do nothing.
    }
    /**
     * <p>
     * Logs the WebGL <code>VERSION</code> parameter to the console.
     * </p>
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        var gl = manager.gl
        console.log(gl.getParameter(gl.VERSION))
    }
    contextLost(canvasId?: number): void {
        // Do nothing.
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        // Do nothing.
    }
    get name(): string {
        return QUALIFIED_NAME
    }
}
