import Buffer = require('../core/Buffer');
import ContextManager = require('../core/ContextManager');
declare class BufferResource implements Buffer {
    private _context;
    private _monitor;
    private _buffer;
    private _refCount;
    private _uuid;
    private _target;
    constructor(monitor: ContextManager, target: number);
    addRef(): number;
    release(): number;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext): void;
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
