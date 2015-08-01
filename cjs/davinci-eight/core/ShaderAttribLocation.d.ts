import DataUsage = require('../core/DataUsage');
/**
 * Utility class for managing a shader attribute variable.
 * While this class may be created directly by the user, it is preferable
 * to use the ShaderAttribLocation instances managed by the ShaderProgram because
 * there will be improved integrity and context loss management.
 * @class ShaderAttribLocation.
 */
declare class ShaderAttribLocation {
    /**
     * @property name {string} The name of the variable as it appears in the GLSL program.
     */
    private $name;
    /**
     * @property glslType {string} The type of the variable as it appears in the GLSL program.
     */
    private $glslType;
    /**
     * Index of target attribute in the buffer.
     */
    private location;
    private context;
    private buffer;
    /**
     * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
     * In particular, this class manages buffer allocation, location caching, and data binding.
     * @class ShaderAttribLocation
     * @constructor
     * @param name {string} The name of the variable as it appears in the GLSL program.
     * @param glslType {string} The type of the variable as it appears in the GLSL program.
     */
    constructor(name: string, glslType: string);
    name: string;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    contextLoss(): void;
    /**
     * @method dataFormat
     * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
     * @param type {number} Specifies the data type of each component in the array. gl.FLOAT (default) or gl.FIXED.
     * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
     */
    dataFormat(size: number, type: number, normalized?: boolean, stride?: number, offset?: number): void;
    /**
     * FIXME This should not couple to an AttribProvider.
     * @method bufferData
     */
    bufferData(data: Float32Array, usage: DataUsage): void;
    enable(): void;
    disable(): void;
    /**
     * @method toString
     */
    toString(): string;
}
export = ShaderAttribLocation;
