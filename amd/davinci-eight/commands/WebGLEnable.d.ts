import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * enable(capability: number): void
 * <p>
 * @class WebGLEnable
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
declare class WebGLEnable extends Shareable implements IContextCommand, IContextConsumer {
    capability: number;
    /**
     * @class WebGLEnable
     * @constructor
     */
    constructor(capability?: number);
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
     * @method execute
     * @param gl {WebGLRenderingContext}
     * @return {void}
     */
    execute(gl: WebGLRenderingContext): void;
    /**
     * @method destructor
     * @return {void}
     */
    destructor(): void;
    name: string;
}
export = WebGLEnable;
