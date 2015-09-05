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
    hasContext(): boolean;
    /**
     * @method bind
     */
    bind(): void;
    /**
     * @method data
     * @param data {Float32Array}
     * @param usage {number} Optional. Defaults to DYNAMIC_DRAW.
     */
    data(data: Float32Array, usage?: number): void;
}
export = VertexBuffer;
