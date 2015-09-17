import IBuffer = require('../core/IBuffer');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
declare class BufferResource implements IBuffer {
    private _context;
    private _monitor;
    private _buffer;
    private _refCount;
    private _uuid;
    private _target;
    constructor(monitor: ContextMonitor, target: number);
    addRef(): number;
    release(): number;
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
