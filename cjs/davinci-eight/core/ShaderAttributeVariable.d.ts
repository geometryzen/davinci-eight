import AttributeProvider = require('../core/AttributeProvider');
/**
 * Utility class for managing a shader attribute variable.
 * @class
 */
declare class ShaderAttributeVariable {
    name: string;
    /**
     * The numbe of components for the attribute. Must be 1,2,3 , or 4.
     */
    private size;
    private normalized;
    private stride;
    private offset;
    private location;
    private context;
    private buffer;
    /**
     * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
     * In particular, this class manages buffer allocation, location caching, and data binding.
     * @class ShaderAttributeVariable
     * @constructor
     * @param name {string}
     * @param size {number}
     * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
     */
    constructor(name: string, size: number, normalized: boolean, stride: number, offset?: number);
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    contextLoss(): void;
    bind(): void;
    bufferData(attributes: AttributeProvider): void;
    enable(): void;
    disable(): void;
}
export = ShaderAttributeVariable;
