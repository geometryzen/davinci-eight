import { ContextManager } from '../core/ContextManager';
import { ContextProgramConsumer } from '../core/ContextProgramConsumer';
import { DataType } from '../core/DataType';
import { readOnly } from '../i18n/readOnly';

/**
 * An object-oriented representation of an <code>attribute</code> in a GLSL shader program.
 */
export class Attrib implements ContextProgramConsumer {
    /**
     * The name of the attribute in the GLSL program.
     */
    private _name: string;
    /**
     * The index of the attribute in the GLSL program.
     * This is obtained by calling the <code>getAttribLocation</code> method on
     * the <code>WebGLRenderingContext</code> when it becomes available through
     * a <code>contextGain</code> notification.
     */
    private _index: number;
    /**
     * The cached <code>WebGLRenderingContext</code> obtained through
     * a <code>contextGain</code> notification.
     */
    private _gl: WebGLRenderingContext;
    /**
     * 
     */
    private suppressWarnings = true;

    /**
     * 
     */
    constructor(contextManager: ContextManager, info: WebGLActiveInfo) {
        this._name = info.name;
    }

    /**
     * Returns the cached index obtained by calling <code>getAttribLocation</code> on the
     * <code>WebGLRenderingContext</code>.
     */
    get index(): number {
        return this._index;
    }
    set index(unused) {
        throw new Error(readOnly('index').message);
    }

    /**
     * Notifies this <code>Attrib</code> of a browser free WebGL context event.
     * This <code>Attrib</code> responds by setting its cached index and context to undefined.
     */
    contextFree(): void {
        // Nothing to deallocate. Just reflect notification in state variables.
        // This is coincidentally the same as contextLost, but not appropriate for DRY.
        this._index = void 0;
        this._gl = void 0;
    }

    /**
     * Notifies this <code>Attrib</code> of a browser gain WebGL context event.
     * This <code>Attrib</code> responds by obtaining and caching attribute index.
     *
     * @param context
     * @param program
     */
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void {
        this._index = context.getAttribLocation(program, this._name);
        this._gl = context;
    }

    /**
     * Notifies this <code>Attrib</code> of a browser lost WebGL context event.
     * This <code>Attrib</code> responds by setting its cached index and context to undefined.
     */
    contextLost(): void {
        this._index = void 0;
        this._gl = void 0;
    }

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
    config(size: number, type: DataType, normalized = false, stride = 0, offset = 0): void {
        // TODO: Notice that when this function is called, the cached index is used.
        // This suggests that we should used the cached indices to to look up attributes
        // when we are in the animation loop.
        if (this._gl) {
            this._gl.vertexAttribPointer(this._index, size, type, normalized, stride, offset);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn(`vertexAttribPointer(index = ${this._index}, size = ${size}, type = ${type}, normalized = ${normalized}, stride = ${stride}, offset = ${offset})`);
            }
        }
    }

    /**
     * Calls the <code>enableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     */
    enable(): void {
        if (this._gl) {
            this._gl.enableVertexAttribArray(this._index);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn(`enableVertexAttribArray(index = ${this._index})`);
            }
        }
    }

    /**
     * Calls the <code>disableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     */
    disable(): void {
        if (this._gl) {
            this._gl.disableVertexAttribArray(this._index);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn(`disableVertexAttribArray(index = ${this._index})`);
            }
        }
    }

    /**
     * Returns the address of the specified vertex attribute.
     * Experimental.
     */
    getOffset(): number {
        if (this._gl) {
            // The API docs don't permit the pname attribute to be anything other than VERTEX_ATTRIB_ARRAY_POINTER.
            return this._gl.getVertexAttribOffset(this._index, this._gl.VERTEX_ATTRIB_ARRAY_POINTER);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn(`getVertexAttribOffset(index = ${this._index}, VERTEX_ATTRIB_ARRAY_POINTER)`);
            }
            return void 0;
        }
    }

    /**
     * Returns a non-normative string representation of the GLSL attribute.
     */
    toString(): string {
        return ['attribute', this._name].join(' ');
    }
}
