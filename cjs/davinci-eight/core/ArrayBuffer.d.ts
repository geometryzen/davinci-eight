import RenderingContextUser = require('../core/RenderingContextUser');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare class ArrayBuffer implements RenderingContextUser {
    private _context;
    private _monitor;
    private _buffer;
    private _refCount;
    constructor(monitor: RenderingContextMonitor);
    addRef(): number;
    release(): number;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    /**
     * @method bind
     */
    bind(target: number): void;
}
export = ArrayBuffer;
