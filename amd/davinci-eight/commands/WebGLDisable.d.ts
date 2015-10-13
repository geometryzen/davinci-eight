import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * disable(capability: string): void
 * <p>
 * @class WebGLDisable
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
declare class WebGLDisable extends Shareable implements IContextCommand, IContextConsumer {
    private _capability;
    /**
     * @class WebGLDisable
     * @constructor
     * @param capability {string} The name of the WebGLRenderingContext property to be disabled.
     */
    constructor(capability: string);
    /**
     * @method contextFree
     * @param canvasId {number}
     * @return {void}
     */
    contextFree(canvasId: number): void;
    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void;
    /**
     * @method contextLost
     * @param canvasId {number}
     * @return {void}
     */
    contextLost(canvasId: number): void;
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
}
export = WebGLDisable;
