import RenderingContextUser = require('../core/RenderingContextUser');
declare class ArrayBuffer implements RenderingContextUser {
    private _context;
    private _buffer;
    private _refCount;
    constructor();
    addRef(): void;
    release(): void;
    private _free();
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    hasContext(): boolean;
    /**
     * @method bindBuffer
     */
    bindBuffer(): void;
    /**
     * @method bufferData
     * @param data {Float32Array}
     * @param usage {number} Optional. Defaults to DYNAMIC_DRAW.
     */
    bufferData(data: Float32Array, usage?: number): void;
}
export = ArrayBuffer;
