import ContextManager = require('../core/ContextManager');
import IPrologCommand = require('../core/IPrologCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * clear(mask: number): void
 * <p>
 * @class WebGLClear
 * @extends Shareable
 * @implements IContextCommand
 */
declare class WebGLClear extends Shareable implements IPrologCommand {
    /**
     * The mask used to specify which buffers to clear.
     * @property mask
     * @type {number}
     */
    mask: number;
    /**
     * @class WebGLClear
     * @constructor
     */
    constructor(mask: number);
    /**
     * @method destructor
     * @return {void}
     */
    destructor(): void;
    /**
     * @method execute
     * @param gl {WebGLRenderingContext}
     * @return {void}
     */
    execute(manager: ContextManager): void;
    /**
     * @property name
     * @type {string}
     * @readOnly
     */
    name: string;
}
export = WebGLClear;
