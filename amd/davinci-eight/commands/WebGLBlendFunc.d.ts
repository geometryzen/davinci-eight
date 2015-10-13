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
    sfactor: string;
    dfactor: string;
    /**
     * @class WebGLBlendFunc
     * @constructor
     * @param sfactor {string}
     * @param dfactor {string}
     */
    constructor(sfactor: string, dfactor: string);
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
    private execute(gl);
    /**
     * @method destructor
     * @return {void}
     */
    destructor(): void;
}
export = WebGLBlendFunc;
