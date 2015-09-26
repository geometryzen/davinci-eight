import IBuffer = require('../core/IBuffer');
import IContextProvider = require('../core/IContextProvider');
import Shareable = require('../utils/Shareable');
declare class BufferResource extends Shareable implements IBuffer {
    private _buffer;
    private manager;
    private _isElements;
    constructor(manager: IContextProvider, isElements: boolean);
    protected destructor(): void;
    contextFree(canvasId: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(): void;
    /**
     * @method bind
     */
    bind(): void;
    /**
     * @method unbind
     */
    unbind(): void;
}
export = BufferResource;
