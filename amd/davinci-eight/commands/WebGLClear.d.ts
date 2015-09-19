import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * clear(mask: number): void
 * <p>
 * @class WebGLClear
 * @extends Shareable
 * @implements IContextCommand
 */
declare class WebGLClear extends Shareable implements IContextCommand {
    mask: number;
    /**
     * @class WebGLClear
     * @constructor
     */
    constructor(mask: number);
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
export = WebGLClear;
