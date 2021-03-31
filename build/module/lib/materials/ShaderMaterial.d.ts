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
 * @hidden
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
     * 1. Creates a subscription to WebGL rendering context events but does not synchronize.
     * 2. Constructs vertex and fragment shader sources.
     * 3. Synchronizes with the WebGL rendering context if this is a top-level class (levelUp is zero).
     *
     * The contextManager must be defined.
     *
     * @param vertexShaderSrc The vertex shader source code.
     * @param fragmentShaderSrc The fragment shader source code.
     * @param attribs The attribute ordering.
     * @param contextManager The <code>ContextManager</code> to subscribe to for WebGL rendering context events.
     * @param levelUp The level of this class in the implementation inheritance hierarchy.
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
    get vertexShaderSrc(): string;
    /**
     *
     */
    get fragmentShaderSrc(): string;
    /**
     *
     */
    get attributeNames(): string[];
    set attributeNames(unused: string[]);
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
    uniform1f(name: string, x: number): void;
    uniform1fv(name: string, data: Float32Array, srcOffset?: number, srcLength?: number): void;
    uniform1i(name: string, x: number): void;
    uniform1iv(name: string, data: Int32Array, srcOffset?: number, srcLength?: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform2fv(name: string, data: Float32Array, srcOffset?: number, srcLength?: number): void;
    uniform2i(name: string, x: number, y: number): void;
    uniform2iv(name: string, src: Int32Array, srcOffset?: number, srcLength?: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform3fv(name: string, data: Float32Array, srcOffset: number, srcLength: number): void;
    uniform3i(name: string, x: number, y: number, z: number): void;
    uniform3iv(name: string, src: Int32Array, srcOffset?: number, srcLength?: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    uniform4fv(name: string, data: Float32Array, srcOffset?: number, srcLength?: number): void;
    uniform4i(name: string, x: number, y: number, z: number, w: number): void;
    uniform4iv(name: string, src: Int32Array, srcOffset?: number, srcLength?: number): void;
    uniform(name: string, value: number | number[]): Material;
    /**
     *
     */
    use(): ShaderMaterial;
    matrix2fv(name: string, matrix: Float32Array, transpose?: boolean): this;
    matrix3fv(name: string, matrix: Float32Array, transpose?: boolean): this;
    matrix4fv(name: string, matrix: Float32Array, transpose?: boolean): this;
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
