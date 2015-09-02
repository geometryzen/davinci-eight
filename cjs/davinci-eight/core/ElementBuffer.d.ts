/**
 * Manages the WebGLBuffer used to support gl.drawElements().
 * @class ElementBuffer
 */
declare class ElementBuffer {
    private _buffer;
    private _context;
    private _refCount;
    /**
     * @class ElementArray
     * @constructor
     */
    constructor();
    addRef(): void;
    release(): void;
    /**
     * @method contextFree
     */
    contextFree(): void;
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     */
    contextGain(context: WebGLRenderingContext): void;
    /**
     * @method contextLoss
     */
    contextLoss(): void;
    /**
     * @method bindBuffer
     */
    bindBuffer(): void;
    /**
     * @method bufferData
     * @param data {Uint16Array}
     * @param usage {number} Optional. Defaults to STREAM_DRAW.
     */
    bufferData(data: Uint16Array, usage?: number): void;
}
export = ElementBuffer;
