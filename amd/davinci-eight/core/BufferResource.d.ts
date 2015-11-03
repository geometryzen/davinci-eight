import IBuffer = require('../core/IBuffer');
import IContextProvider = require('../core/IContextProvider');
import Shareable = require('../utils/Shareable');
/**
 * @class BufferResource
 * @extends Shareable
 */
declare class BufferResource extends Shareable implements IBuffer {
    private _buffer;
    private manager;
    private _isElements;
    /**
     * @class BufferResource
     * @constructor
     * @param manager {IContextProvider}
     * @param isElements {boolean}
     */
    constructor(manager: IContextProvider, isElements: boolean);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
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
     * @return {void}
     */
    contextLost(): void;
    /**
     * @method bind
     * @return {void}
     */
    bind(): void;
    /**
     * @method unbind
     * @return {void}
     */
    unbind(): void;
}
export = BufferResource;
