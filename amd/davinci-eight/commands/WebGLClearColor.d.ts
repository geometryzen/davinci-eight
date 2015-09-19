import ContextListener = require('../core/ContextListener');
import ContextManager = require('../core/ContextManager');
import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * clearColor(red: number, green: number, blue: number, alpha: number): void
 * <p>
 * @class WebGLClearColor
 * @extends Shareable
 * @implements IContextCommand
 * @implements ContextListener
 */
declare class WebGLClearColor extends Shareable implements IContextCommand, ContextListener {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    /**
     * @class WebGLClearColor
     * @constructor
     */
    constructor(red?: number, green?: number, blue?: number, alpha?: number);
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
export = WebGLClearColor;
