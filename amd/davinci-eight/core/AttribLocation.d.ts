import IContextProgramConsumer = require('../core/IContextProgramConsumer');
import IContextProvider = require('../core/IContextProvider');
/**
 * @class AttribLocation
 */
declare class AttribLocation implements IContextProgramConsumer {
    /**
     * The name of the attribute in the GLSL program.
     * @property _name
     * @type {string}
     * @private
     */
    private _name;
    /**
     * The index of the attribute in the GLSL program.
     * This is obtained by calling the <code>getAttribLocation</code> method on
     * the <code>WebGLRenderingContext</code> when it becomes available through
     * a <code>contextGain</code> notification.
     * @property _index
     * @type {number}
     * @private
     */
    private _index;
    /**
     * The cached <code>WebGLRenderingContext</code> obtained through
     * a <code>contextGain</code> notification.
     * @property _context
     * @type {WebGLRenderingContext}
     * @private
     */
    private _context;
    /**
     * Utility class for managing a shader attribute variable.
     * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
     * In particular, this class manages buffer allocation, location caching, and data binding.
     * While this class may be created directly by the user, it is preferable
     * to use the AttribLocation instances managed by the Program because
     * there will be improved integrity and context loss management.
     * @class AttribLocation
     * @constructor
     * @param manager {IContextProvider} Unused. May be used later e.g. for mirroring.
     * @param name {string} The name of the variable as it appears in the GLSL program.
     */
    constructor(manager: IContextProvider, name: string);
    /**
     * Returns the cached index obtained by calling <code>getAttribLocation</code> on the
     * <code>WebGLRenderingContext</code>.
     * @property index
     * @type {number}
     * @readOnly
     */
    index: number;
    /**
     * Notifies this <code>AttribLocation</code> of a browser free WebGL context event.
     * This <code>AttribLocation</code> responds by setting its cached index and context to undefined.
     * @method contextFree
     * @return {void}
     */
    contextFree(): void;
    /**
     * Notifies this <code>AttribLocation</code> of a browser gain WebGL context event.
     * This <code>AttribLocation</code> responds by obtaining and caching attribute index.
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     * @return {void}
     */
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    /**
     * Notifies this <code>AttribLocation</code> of a browser lost WebGL context event.
     * This <code>AttribLocation</code> responds by setting its cached index and context to undefined.
     * @method contextLost
     * @return {void}
     */
    contextLost(): void;
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
    vertexPointer(size: number, normalized?: boolean, stride?: number, offset?: number): void;
    /**
     * Calls the <code>enableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     * @method enable
     * @return {void}
     */
    enable(): void;
    /**
     * Calls the <code>disableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     * @method disable
     * @return {void}
     */
    disable(): void;
    /**
     * Returns a non-normative string representation of the GLSL attribute.
     * @method toString
     * @return {string}
     */
    toString(): string;
}
export = AttribLocation;
