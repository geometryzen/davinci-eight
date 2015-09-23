import IBuffer = require('../core/IBuffer');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import Shareable = require('../utils/Shareable');
declare class BufferResource extends Shareable implements IBuffer {
    private _buffer;
    private _gl;
    private _monitor;
    private _isElements;
    constructor(monitor: ContextMonitor, isElements: boolean);
    protected destructor(): void;
    contextFree(): void;
    contextGain(manager: ContextManager): void;
    contextLoss(): void;
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
