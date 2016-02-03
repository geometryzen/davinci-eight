import AttribLocation from '../core/AttribLocation';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import core from '../core';
import isDefined from '../checks/isDefined';
import isUndefined from '../checks/isUndefined';
import MonitorList from '../scene/MonitorList';
import IGraphicsProgram from '../core/IGraphicsProgram';
import R1 from '../math/R1';
import Mat2R from '../math/Mat2R';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import refChange from '../utils/refChange';
import Shareable from '../utils/Shareable';
import UniformLocation from '../core/UniformLocation';
import uuid4 from '../utils/uuid4';
import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';

function consoleWarnDroppedUniform(clazz: string, suffix: string, name: string, canvasId: number) {
    console.warn(clazz + " dropped uniform" + suffix + " " + name)
    console.warn("`typeof canvasId` is " + typeof canvasId)
}

/**
 * @class GraphicsProgram
 * @extends Shareable
 */
export default class GraphicsProgram extends Shareable implements IGraphicsProgram {
    /**
     * @property inner
     * @type {IGraphicsProgram}
     * @private
     */
    private inner: IGraphicsProgram;
    private readyPending: boolean = false;
    private _monitors: MonitorList;
    /**
     * The name used for logging and assigned in the constructor.
     * @property type
     * @type {string}
     * @private
     */
    private type: string;

    /**
     * A GraphicsProgram instance contains one WebGLProgram for each context/canvas that it is associated with.
     * @class GraphicsProgram
     * @constructor
     * @param type {string} The class name, used for logging.
     * @param [monitors=[]] {IContextMonitor[]} An array of context monitors, one for each HTML canvas you are using.
     * The GraphicsProgram will lazily register itself (call addContextListener) with each context in order to be notified of context loss events.
     * The GraphicsProgram will automatically unregister itself (call removeContextListener) prior to destruction.
     */
    constructor(type: string, monitors: IContextMonitor[] = []) {
        super('GraphicsProgram')
        MonitorList.verify('monitors', monitors)
        mustBeString('type', type)
        this._monitors = MonitorList.copy(monitors)
        this.type = type
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._monitors.removeContextListener(this)
        this._monitors.release()
        this._monitors = void 0
        if (this.inner) {
            this.inner.release()
            this.inner = void 0
        }
    }

    /**
     * Registers this GraphicsProgram with the context monitors and synchronizes the WebGL contexts.
     * This causes this GraphicsProgram instance to receive a contextGain call allowing WebGLProgram initialization.
     * @method makeReady
     * @param async {boolean} Reserved for future use.
     * @protected
     */
    protected makeReady(async: boolean): void {
        if (!this.readyPending) {
            this.readyPending = true
            this._monitors.addContextListener(this)
            this._monitors.synchronize(this)
        }
    }

    /**
     * Returns the context monitors this GraphicsProgram is associated with.
     * @property monitors
     * @type {IContextMonitor[]}
     */
    get monitors(): IContextMonitor[] {
        return this._monitors.toArray()
    }

    /**
     * Returns the generated fragment shader code as a string.
     * @property fragmentShader
     * @type {string}
     */
    get fragmentShader(): string {
        if (this.inner) {
            return this.inner.fragmentShader
        }
        else {
            let async = false
            this.makeReady(async)
            if (this.inner) {
                return this.inner.fragmentShader
            }
            else {
                return void 0
            }
        }
    }

    /**
     * Makes the WebGLProgram associated with the specified canvas the current program for WebGL.
     * @method use
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    use(canvasId: number): void {
        if (this.inner) {
            return this.inner.use(canvasId)
        }
        else {
            let async = false
            this.makeReady(async)
            if (this.inner) {
                return this.inner.use(canvasId)
            }
            else {
                if (core.verbose) {
                    console.warn(this.type + " is not ready for use. Maybe did not receive contextGain?")
                }
            }
        }
    }

    /**
     * Returns a map of GLSL attribute name to <code>AttribLocation</code>.
     * @method attributes
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {{[name: string]: AttribLocation}}
     */
    attributes(canvasId: number): { [name: string]: AttribLocation } {
        // FIXME: Why is this called?
        // FIXME: The map should be protected but that is slow
        // FIXME Clear need for performant solution.
        if (this.inner) {
            return this.inner.attributes(canvasId)
        }
        else {
            let async = false
            this.makeReady(async)
            if (this.inner) {
                return this.inner.attributes(canvasId)
            }
            else {
                return void 0
            }
        }
    }

    /**
     * @method uniforms
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {{[name: string]: UniformLocation}}
     */
    uniforms(canvasId: number): { [name: string]: UniformLocation } {
        if (this.inner) {
            return this.inner.uniforms(canvasId)
        }
        else {
            let async = false
            this.makeReady(async)
            if (this.inner) {
                return this.inner.uniforms(canvasId)
            }
            else {
                return void 0
            }
        }
    }

    /**
     * @method enableAttrib
     * @param name {string}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    enableAttrib(name: string, canvasId: number): void {
        if (this.inner) {
            return this.inner.enableAttrib(name, canvasId)
        }
        else {
            let async = false
            this.makeReady(async)
            if (this.inner) {
                return this.inner.enableAttrib(name, canvasId)
            }
            else {
                console.warn(this.type + " enableAttrib()")
            }
        }
    }

    /**
     * @method disableAttrib
     * @param name {string}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    disableAttrib(name: string, canvasId: number) {
        if (this.inner) {
            return this.inner.disableAttrib(name, canvasId)
        }
        else {
            let async = false
            this.makeReady(async)
            if (this.inner) {
                return this.inner.disableAttrib(name, canvasId)
            }
            else {
                console.warn(this.type + " disableAttrib()")
            }
        }
    }

    /**
     * @method contextFree
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    contextFree(canvasId: number): void {
        if (this.inner) {
            this.inner.contextFree(canvasId)
        }
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider) {
        if (isUndefined(this.inner)) {
            this.inner = this.createGraphicsProgram()
        }
        if (isDefined(this.inner)) {
            this.inner.contextGain(manager)
        }
    }

    /**
     * @method contextLost
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    contextLost(canvasId: number) {
        if (this.inner) {
            this.inner.contextLost(canvasId)
        }
    }

    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram {
        // FIXME Since we get contextGain by canvas, expect canvasId to be an argument?
        throw new Error("GraphicsProgram createGraphicsProgram method is virtual and should be implemented by " + this.type)
    }

    /**
     * @method uniform1f
     * @param name {string}
     * @param x {number}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniform1f(name: string, x: number, canvasId: number): void {
        if (this.inner) {
            this.inner.uniform1f(name, x, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.uniform1f(name, x, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, '1f', name, canvasId)
                }
            }
        }
    }

    /**
     * @method uniform2f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniform2f(name: string, x: number, y: number, canvasId: number): void {
        if (this.inner) {
            this.inner.uniform2f(name, x, y, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.uniform2f(name, x, y, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, '2f', name, canvasId)
                }
            }
        }
    }

    /**
     * @method uniform3f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    uniform3f(name: string, x: number, y: number, z: number, canvasId: number): void {
        if (this.inner) {
            this.inner.uniform3f(name, x, y, z, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.uniform3f(name, x, y, z, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, '3f', name, canvasId)
                }
            }
        }
    }

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
    uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId: number): void {
        if (this.inner) {
            this.inner.uniform4f(name, x, y, z, w, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.uniform4f(name, x, y, z, w, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, '4f', name, canvasId)
                }
            }
        }
    }

    /**
     * @method mat2
     * @param name {string}
     * @param matrix {Mat2R}
     * @param [transpose] {boolean}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    mat2(name: string, matrix: Mat2R, transpose: boolean, canvasId: number): void {
        if (this.inner) {
            this.inner.mat2(name, matrix, transpose, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.mat2(name, matrix, transpose, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, 'Mat2R', name, canvasId)
                }
            }
        }
    }

    /**
     * @method mat3
     * @param name {string}
     * @param matrix {Mat3R}
     * @param [transpose] {boolean}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    mat3(name: string, matrix: Mat3R, transpose: boolean, canvasId: number): void {
        if (this.inner) {
            this.inner.mat3(name, matrix, transpose, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.mat3(name, matrix, transpose, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, 'Mat3R', name, canvasId)
                }
            }
        }
    }

    /**
     * @method mat4
     * @param name {string}
     * @param matrix {Mat4R}
     * @param [transpose] {boolean}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    mat4(name: string, matrix: Mat4R, transpose: boolean, canvasId: number): void {
        if (this.inner) {
            this.inner.mat4(name, matrix, transpose, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.mat4(name, matrix, transpose, canvasId)
            }
            else {
                if (!readyPending) {
                    if (core.verbose) {
                        consoleWarnDroppedUniform(this.type, 'Mat4R', name, canvasId)
                    }
                }
            }
        }
    }

    /**
     * @method vec2
     * @param name {string}
     * @param vector {VectorE2}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vec2(name: string, vector: VectorE2, canvasId: number): void {
        if (this.inner) {
            this.inner.vec2(name, vector, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.vec2(name, vector, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, 'VectorE2', name, canvasId)
                }
            }
        }
    }

    /**
     * @method vec3
     * @param name {string}
     * @param vector {VectorE3}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vec3(name: string, vector: VectorE3, canvasId: number): void {
        if (this.inner) {
            this.inner.vec3(name, vector, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.vec3(name, vector, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, 'VectorE3', name, canvasId)
                }
            }
        }
    }

    /**
     * @method vec4
     * @param name {string}
     * @param vector {VectorE4}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vec4(name: string, vector: VectorE4, canvasId: number): void {
        if (this.inner) {
            this.inner.vec4(name, vector, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.vec4(name, vector, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, 'VectorE4', name, canvasId)
                }
            }
        }
    }

    /**
     * @method vector2
     * @param name {string}
     * @param data {number[]}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vector2(name: string, data: number[], canvasId: number): void {
        if (this.inner) {
            this.inner.vector2(name, data, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.vector2(name, data, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, 'vector2', name, canvasId)
                }
            }
        }
    }

    /**
     * @method vector3
     * @param name {string}
     * @param data {number[]}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vector3(name: string, data: number[], canvasId: number): void {
        if (this.inner) {
            this.inner.vector3(name, data, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.vector3(name, data, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, 'vector3', name, canvasId)
                }
            }
        }
    }

    /**
     * @method vector4
     * @param name {string}
     * @param data {number[]}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    vector4(name: string, data: number[], canvasId: number): void {
        if (this.inner) {
            this.inner.vector4(name, data, canvasId)
        }
        else {
            let async = false
            let readyPending = this.readyPending
            this.makeReady(async)
            if (this.inner) {
                this.inner.vector4(name, data, canvasId)
            }
            else {
                if (!readyPending) {
                    consoleWarnDroppedUniform(this.type, 'vector4', name, canvasId)
                }
            }
        }
    }

    /**
     * Returns the generated shader vertex code as a string.
     * @property vertexShader
     * @type {string}
     */
    get vertexShader(): string {
        if (this.inner) {
            return this.inner.vertexShader
        }
        else {
            let async = false
            this.makeReady(async)
            if (this.inner) {
                return this.inner.vertexShader
            }
            else {
                return void 0
            }
        }
    }
}
