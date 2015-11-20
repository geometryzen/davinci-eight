import AttribLocation = require('../core/AttribLocation');
import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Shareable = require('../utils/Shareable');
import UniformLocation = require('../core/UniformLocation');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');
/**
 * @class GraphicsProgram
 * @extends Shareable
 */
declare class GraphicsProgram extends Shareable implements IGraphicsProgram {
    /**
     * @property inner
     * @type {IGraphicsProgram}
     * @private
     */
    private inner;
    private readyPending;
    private _monitors;
    /**
     * The name used for logging and assigned in the constructor.
     * @property type
     * @type {string}
     * @private
     */
    private type;
    /**
     * A GraphicsProgram instance contains one WebGLProgram for each context/canvas that it is associated with.
     * @class GraphicsProgram
     * @constructor
     * @param contexts {IContextMonitor[]} An array of context monitors, one for each HTML canvas you are using.
     * The GraphicsProgram will lazily register itself (call addContextListener) with each context in order to be notified of context loss events.
     * The GraphicsProgram will automatically unregister itself (call removeContextListener) prior to destruction.
     * @param type {string} The class name, used for logging.
     */
    constructor(contexts: IContextMonitor[], type: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * Registers this GraphicsProgram with the context monitors and synchronizes the WebGL contexts.
     * This causes this GraphicsProgram instance to receive a contextGain call allowing WebGLProgram initialization.
     * @method makeReady
     * @param async {boolean} Reserved for future use.
     * @protected
     */
    protected makeReady(async: boolean): void;
    /**
     * Returns the context monitors this GraphicsProgram is associated with.
     * @property monitors
     * @type {IContextMonitor[]}
     */
    monitors: IContextMonitor[];
    /**
     * Returns the generated fragment shader code as a string.
     * @property fragmentShader
     * @type {string}
     */
    fragmentShader: string;
    /**
     * Makes the WebGLProgram associated with the specified canvas the current program for WebGL.
     * @method use
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    use(canvasId?: number): void;
    /**
     * Returns a map of GLSL attribute name to <code>AttribLocation</code>.
     * @method attributes
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {{[name: string]: AttribLocation}}
     */
    attributes(canvasId?: number): {
        [name: string]: AttribLocation;
    };
    /**
     * @method uniforms
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {{[name: string]: UniformLocation}}
     */
    uniforms(canvasId?: number): {
        [name: string]: UniformLocation;
    };
    /**
     * @method enableAttrib
     * @param name {string}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    enableAttrib(name: string, canvasId?: number): void;
    /**
     * @method disableAttrib
     * @param name {string}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    disableAttrib(name: string, canvasId?: number): void;
    /**
     * @method contextFree
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    contextFree(canvasId?: number): void;
    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void;
    /**
     * @method contextLost
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    contextLost(canvasId?: number): void;
    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram;
    /**
     * @method uniform1f
     * @param name {string}
     * @param x {number}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniform1f(name: string, x: number, canvasId?: number): void;
    /**
     * @method uniform2f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniform2f(name: string, x: number, y: number, canvasId?: number): void;
    /**
     * @method uniform3f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniform3f(name: string, x: number, y: number, z: number, canvasId?: number): void;
    /**
     * @method uniform4f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param w {number}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId?: number): void;
    /**
     * @method uniformMatrix2
     * @param name {string}
     * @param transpose {boolean}
     * @param matrix {Matrix2}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2, canvasId?: number): void;
    /**
     * @method uniformMatrix3
     * @param name {string}
     * @param transpose {boolean}
     * @param matrix {Matrix3}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3, canvasId?: number): void;
    /**
     * @method uniformMatrix4
     * @param name {string}
     * @param transpose {boolean}
     * @param matrix {Matrix4}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4, canvasId?: number): void;
    /**
     * @method uniformVectorE2
     * @param name {string}
     * @param vector {VectorE2}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniformVectorE2(name: string, vector: VectorE2, canvasId?: number): void;
    /**
     * @method uniformVectorE3
     * @param name {string}
     * @param vector {VectorE3}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniformVectorE3(name: string, vector: VectorE3, canvasId?: number): void;
    /**
     * @method uniformVectorE4
     * @param name {string}
     * @param vector {VectorE4}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniformVectorE4(name: string, vector: VectorE4, canvasId?: number): void;
    /**
     * @method vector2
     * @param name {string}
     * @param data {number[]}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vector2(name: string, data: number[], canvasId?: number): void;
    /**
     * @method vector3
     * @param name {string}
     * @param data {number[]}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vector3(name: string, data: number[], canvasId?: number): void;
    /**
     * @method vector4
     * @param name {string}
     * @param data {number[]}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vector4(name: string, data: number[], canvasId?: number): void;
    /**
     * Returns the generated shader vertex code as a string.
     * @property vertexShader
     * @type {string}
     */
    vertexShader: string;
}
export = GraphicsProgram;
