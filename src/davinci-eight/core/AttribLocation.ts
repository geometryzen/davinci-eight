import ContextProgramConsumer from  '../core/ContextProgramConsumer';
import readOnly from  '../i18n/readOnly';

export default class AttribLocation implements ContextProgramConsumer {

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

    constructor(info: WebGLActiveInfo) {
        this._name = info.name
    }

    /**
     * Returns the cached index obtained by calling <code>getAttribLocation</code> on the
     * <code>WebGLRenderingContext</code>.
     */
    get index(): number {
        return this._index
    }
    set index(unused) {
        throw new Error(readOnly('index').message)
    }

    /**
     * Notifies this <code>AttribLocation</code> of a browser free WebGL context event.
     * This <code>AttribLocation</code> responds by setting its cached index and context to undefined.
     *
     * @method contextFree
     * @return {void}
     */
    contextFree(): void {
        // Nothing to deallocate. Just reflect notification in state variables.
        // This is coincidentally the same as contextLost, but not appropriate for DRY.
        this._index = void 0
        this._gl = void 0
    }

    /**
     * Notifies this <code>AttribLocation</code> of a browser gain WebGL context event.
     * This <code>AttribLocation</code> responds by obtaining and caching attribute index.
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     * @return {void}
     */
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void {
        this._index = context.getAttribLocation(program, this._name);
        this._gl = context;
    }

    /**
     * Notifies this <code>AttribLocation</code> of a browser lost WebGL context event.
     * This <code>AttribLocation</code> responds by setting its cached index and context to undefined.
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        this._index = void 0;
        this._gl = void 0;
    }

    /**
     * Calls the <code>vertexAttribPointer</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index and the supplied parameters.
     * Note that the <code>type</code> parameter is hard-code to <code>FLOAT</code>.
     * @method vertexPointer
     * @param size {number} The number of components per attribute. Must be 1, 2, 3, or 4.
     * @param [normalized = false] {boolean} Used for WebGL rendering context vertexAttribPointer method.
     * @param [stride = 0] {number} Used for WebGL rendering context vertexAttribPointer method.
     * @param [offset = 0] {number} Used for WebGL rendering context vertexAttribPointer method.
     * @return {void}
     */
    vertexPointer(size: number, normalized = false, stride = 0, offset = 0): void {
        // TODO: Notice that when this function is called, the cached index is used.
        // This suggests that we should used the cached indices to to look up attributes
        // when we are in the animation loop.
        this._gl.vertexAttribPointer(this._index, size, this._gl.FLOAT, normalized, stride, offset);
    }

    /**
     * Calls the <code>enableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     * @method enable
     * @return {void}
     */
    enable(): void {
        this._gl.enableVertexAttribArray(this._index);
    }

    /**
     * Calls the <code>disableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     * @method disable
     * @return {void}
     */
    disable(): void {
        this._gl.disableVertexAttribArray(this._index);
    }

    /**
     * Returns a non-normative string representation of the GLSL attribute.
     * @method toString
     * @return {string}
     */
    toString(): string {
        return ['attribute', this._name].join(' ');
    }
}
