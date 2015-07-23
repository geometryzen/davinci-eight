import AttributeProvider = require('../core/AttributeProvider');
/**
 * Utility class for managing a shader attribute variable.
 * @class
 */
declare class ShaderAttributeVariable {
    name: string;
    type: string;
    /**
     * The numbe of components for the attribute. Must be 1,2,3 , or 4.
     */
    private location;
    private context;
    private buffer;
    /**
     * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
     * In particular, this class manages buffer allocation, location caching, and data binding.
     * @class ShaderAttributeVariable
     * @constructor
     * @param name {string}
     */
    constructor(name: string, type: string);
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    contextLoss(): void;
    /**
     * @method dataFormat
     * @param size {number}
     * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
     */
    dataFormat(size: number, normalized?: boolean, stride?: number, offset?: number): void;
    /**
     * FIXME This should not couple to an AttributeProvider.
     * @method bufferData
     */
    bufferData(attributes: AttributeProvider): void;
    enable(): void;
    disable(): void;
}
export = ShaderAttributeVariable;
