import VertexAttributeProvider = require('../core/VertexAttributeProvider');
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
     * @param attributes {VertexAttributeProvider}
     */
    constructor(attributes: VertexAttributeProvider);
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
     * @method bufferData
     * @param attributes {VertexAttributeProvider}
     */
    bufferData(attributes: VertexAttributeProvider): void;
    /**
     * @method bind
     */
    bind(): void;
}
export = ElementArray;
