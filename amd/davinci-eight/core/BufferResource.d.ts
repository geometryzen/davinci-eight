import IBuffer = require('../core/IBuffer');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
declare class BufferResource implements IBuffer {
    private _buffer;
    private _gl;
    private _monitor;
    private _refCount;
    private _target;
    private _uuid;
    constructor(monitor: ContextMonitor, target: number);
    private destructor();
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
