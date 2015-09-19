import ContextListener = require('../core/ContextListener');
import ContextManager = require('../core/ContextManager');
import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * enable(capability: number): void
 * <p>
 * @class WebGLEnable
 * @extends Shareable
 * @implements IContextCommand
 * @implements ContextListener
 */
declare class WebGLEnable extends Shareable implements IContextCommand, ContextListener {
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
     * @param manager {ContextManager}
     * @return {void}
     */
    contextGain(manager: ContextManager): void;
    /**
     * @method contextLoss
     * @param canvasId {number}
     * @return {void}
     */
    contextLoss(canvasId: number): void;
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
}
export = WebGLEnable;
