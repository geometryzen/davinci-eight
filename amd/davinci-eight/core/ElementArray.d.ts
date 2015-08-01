import AttribProvider = require('../core/AttribProvider');
/**
 * Manages the (optional) WebGLBuffer used to support gl.drawElements().
 * @class ElementArray
 */
declare class ElementArray {
    private buffer;
    private attributes;
    private context;
    /**
     * @class ElementArray
     * @constructor
     * @param attributes {AttribProvider}
     */
    constructor(attributes: AttribProvider);
    /**
     * @method contextFree
     */
    contextFree(): void;
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     */
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    /**
     * @method contextLoss
     */
    contextLoss(): void;
    /**
     * @method bufferData
     * @param attributes {AttribProvider}
     */
    bufferData(attributes: AttribProvider): void;
    /**
     * @method bind
     */
    bind(): void;
}
export = ElementArray;
