import BlendFactor = require('../commands/BlendFactor');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * @class WebGLBlendFunc
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
declare class WebGLBlendFunc extends Shareable implements IContextCommand {
    sfactor: BlendFactor;
    dfactor: BlendFactor;
    /**
     * @class WebGLBlendFunc
     * @constructor
     * @param sfactor {BlendFactor}
     * @param dfactor {BlendFactor}
     */
    constructor(sfactor: BlendFactor, dfactor: BlendFactor);
    /**
     * @method contextFree
     * @param [canvasId] {number}
     * @return {void}
     */
    contextFree(canvasId?: number): void;
    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void;
    /**
     * @method contextLost
     * @param [canvasId] {number}
     * @return {void}
     */
    contextLost(canvasId?: number): void;
    private execute(gl);
    /**
     * @method destructor
     * @return {void}
     */
    destructor(): void;
}
export = WebGLBlendFunc;
