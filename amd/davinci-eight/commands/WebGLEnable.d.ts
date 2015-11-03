import Capability = require('../commands/Capability');
import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import IContextCommand = require('../core/IContextCommand');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * enable(capability: Capability): void
 * <p>
 * @class WebGLEnable
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
declare class WebGLEnable extends Shareable implements IContextCommand, IContextConsumer {
    private _capability;
    /**
     * @class WebGLEnable
     * @constructor
     * @param capability {Capability} The capability to be enabled.
     */
    constructor(capability: Capability);
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
export = WebGLEnable;
