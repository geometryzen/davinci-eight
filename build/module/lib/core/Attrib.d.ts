import { ContextManager } from '../core/ContextManager';
import { ContextProgramConsumer } from '../core/ContextProgramConsumer';
import { DataType } from '../core/DataType';
/**
 * An object-oriented representation of an <code>attribute</code> in a GLSL shader program.
 */
export declare class Attrib implements ContextProgramConsumer {
    /**
     * The name of the attribute in the GLSL program.
     */
    private _name;
    /**
     * The index of the attribute in the GLSL program.
     * This is obtained by calling the <code>getAttribLocation</code> method on
     * the <code>WebGLRenderingContext</code> when it becomes available through
     * a <code>contextGain</code> notification.
     */
    private _index;
    /**
     * The cached <code>WebGLRenderingContext</code> obtained through
     * a <code>contextGain</code> notification.
     */
    private _gl;
    /**
     *
     */
    private suppressWarnings;
    /**
     *
     */
    constructor(contextManager: ContextManager, info: WebGLActiveInfo);
    /**
     * Returns the cached index obtained by calling <code>getAttribLocation</code> on the
     * <code>WebGLRenderingContext</code>.
     */
    index: number;
    /**
     * Notifies this <code>Attrib</code> of a browser free WebGL context event.
     * This <code>Attrib</code> responds by setting its cached index and context to undefined.
     */
    contextFree(): void;
    /**
     * Notifies this <code>Attrib</code> of a browser gain WebGL context event.
     * This <code>Attrib</code> responds by obtaining and caching attribute index.
     *
     * @param context
     * @param program
     */
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    /**
     * Notifies this <code>Attrib</code> of a browser lost WebGL context event.
     * This <code>Attrib</code> responds by setting its cached index and context to undefined.
     */
    contextLost(): void;
    /**
     * Specifies the data formats and locations of vertex attributes in a vertex attributes array.
     * Calls the <code>vertexAttribPointer</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index and the supplied parameters.
     * Note that the <code>type</code> parameter is hard-code to <code>FLOAT</code>.
     *
     * @param size The number of components per attribute. Must be 1, 2, 3, or 4.
     * @param type The data type of each component in the array.
     * @param normalized Specifies whether fixed-point data values should be normalized (true), or are converted to fixed point vales (false) when accessed.
     * @param stride The distance in bytes between the beginning of consecutive vertex attributes.
     * @param offset The offset in bytes of the first component in the vertex attribute array. Must be a multiple of type.
     */
    config(size: number, type: DataType, normalized?: boolean, stride?: number, offset?: number): void;
    /**
     * Calls the <code>enableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     */
    enable(): void;
    /**
     * Calls the <code>disableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     */
    disable(): void;
    /**
     * Returns the address of the specified vertex attribute.
     * Experimental.
     */
    getOffset(): number;
    /**
     * Returns a non-normative string representation of the GLSL attribute.
     */
    toString(): string;
}
