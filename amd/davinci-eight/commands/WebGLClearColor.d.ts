import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * clearColor(red: number, green: number, blue: number, alpha: number): void
 * <p>
 * @class WebGLClearColor
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
declare class WebGLClearColor extends Shareable implements IContextCommand, IContextConsumer {
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
export = WebGLClearColor;
