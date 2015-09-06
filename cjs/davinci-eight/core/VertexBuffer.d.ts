import RenderingContextUser = require('../core/RenderingContextUser');
declare class VertexBuffer implements RenderingContextUser {
    private _context;
    private _buffer;
    private _refCount;
    constructor();
    addRef(): void;
    release(): void;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    /**
     * @method bind
     */
    bind(): void;
}
export = VertexBuffer;
