import { Attrib } from '../core/Attrib';
import { BeginMode } from '../core/BeginMode';
import { ContextManager } from '../core/ContextManager';
import { DataType } from '../core/DataType';
import { Material } from '../core/Material';
import { ShareableContextConsumer } from '../core/ShareableContextConsumer';
import { TextureUnit } from '../core/TextureUnit';
import { Uniform } from '../core/Uniform';
import { VertexBuffer } from '../core/VertexBuffer';
/**
 *
 */
export declare class ShaderMaterial extends ShareableContextConsumer implements Material {
    /**
     *
     */
    private _vertexShaderSrc;
    /**
     *
     */
    private _fragmentShaderSrc;
    /**
     *
     */
    private _attribs;
    /**
     *
     */
    private _program;
    /**
     *
     */
    private _attributesByName;
    private _attributesByIndex;
    /**
     *
     */
    private _uniforms;
    /**
     * @param vertexShaderSrc The vertex shader source code.
     * @param fragmentShaderSrc The fragment shader source code.
     * @param attribs The attribute ordering.
     * @param engine The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    constructor(vertexShaderSrc: string, fragmentShaderSrc: string, attribs: string[], contextManager: ContextManager, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     *
     */
    contextGain(): void;
    /**
     *
     */
    contextLost(): void;
    /**
     *
     */
    contextFree(): void;
    /**
     *
     */
    readonly vertexShaderSrc: string;
    /**
     *
     */
    readonly fragmentShaderSrc: string;
    /**
     *
     */
    attributeNames: string[];
    /**
     * Convenience method for dereferencing the name to an attribute location, followed by enabling the attribute.
     */
    enableAttrib(indexOrName: number | string): void;
    /**
     *
     */
    enableAttribs(): void;
    /**
     *
     */
    disableAttrib(indexOrName: number | string): void;
    /**
     *
     */
    disableAttribs(): void;
    attrib(name: string, value: VertexBuffer, size: number, normalized?: boolean, stride?: number, offset?: number): Material;
    getAttrib(indexOrName: number | string): Attrib;
    /**
     * Returns the location (index) of the attribute with the specified name.
     * Returns <code>-1</code> if the name does not correspond to an attribute.
     */
    getAttribLocation(name: string): number;
    /**
     * Returns a <code>Uniform</code> object corresponding to the <code>uniform</code>
     * parameter of the same name in the shader code. If a uniform parameter of the specified name
     * does not exist, this method returns undefined (void 0).
     */
    getUniform(name: string): Uniform;
    /**
     * <p>
     * Determines whether a <code>uniform</code> with the specified <code>name</code> exists in the <code>WebGLProgram</code>.
     * </p>
     */
    hasUniform(name: string): boolean;
    activeTexture(texture: TextureUnit): void;
    uniform1i(name: string, x: number): void;
    uniform1f(name: string, x: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    uniform(name: string, value: number | number[]): Material;
    /**
     *
     */
    use(): ShaderMaterial;
    matrix2fv(name: string, matrix: Float32Array, transpose?: boolean): this;
    matrix3fv(name: string, matrix: Float32Array, transpose?: boolean): this;
    matrix4fv(name: string, matrix: Float32Array, transpose?: boolean): this;
    vector2fv(name: string, data: Float32Array): void;
    vector3fv(name: string, data: Float32Array): void;
    vector4fv(name: string, data: Float32Array): void;
    /**
     * @param mode Specifies the type of the primitive being rendered.
     * @param first Specifies the starting index in the array of vector points.
     * @param count The number of points to be rendered.
     */
    drawArrays(mode: BeginMode, first: number, count: number): Material;
    /**
     * @param mode Specifies the type of the primitive being rendered.
     * @param count The number of elements to be rendered.
     * @param type The type of the values in the element array buffer.
     * @param offset Specifies an offset into the element array buffer.
     */
    drawElements(mode: BeginMode, count: number, type: DataType, offset: number): Material;
}
