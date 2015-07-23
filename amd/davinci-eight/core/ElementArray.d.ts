import AttributeProvider = require('../core/AttributeProvider');
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
     * @param attributes {AttributeProvider}
     */
    constructor(attributes: AttributeProvider);
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
     * @param attributes {AttributeProvider}
     */
    bufferData(attributes: AttributeProvider): void;
    /**
     * @method bind
     */
    bind(): void;
}
export = ElementArray;
