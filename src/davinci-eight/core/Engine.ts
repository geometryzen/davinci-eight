import BlendingFactorDest from './BlendingFactorDest';
import BlendingFactorSrc from './BlendingFactorSrc';
import Capability from './Capability';
import checkEnums from './checkEnums';
import ClearBufferMask from './ClearBufferMask';
import DepthFunction from './DepthFunction';
import config from '../config'
import EIGHTLogger from '../commands/EIGHTLogger';
import ErrorMode from './ErrorMode';
import {ContextConsumer} from './ContextConsumer';
import DefaultContextProvider from '../base/DefaultContextProvider';
import initWebGL from './initWebGL';
import isDefined from '../checks/isDefined';
import mustBeObject from '../checks/mustBeObject';
import ShareableArray from '../collections/ShareableArray';
import {ShareableBase} from './ShareableBase';
import VersionLogger from '../commands/VersionLogger';
import VertexBufferManager from './VertexBufferManager';
import {WebGLClearColor} from '../commands/WebGLClearColor';
import {WebGLEnable} from '../commands/WebGLEnable';
import {WebGLDisable} from '../commands/WebGLDisable';

/**
 *
 *     // Anytime before calling the start method...
 *     const engine = new EIGHT.Engine()
 *
 *     // When the DOM canvas element is available...
 *     engine.start(canvas)
 *
 *     // At the start of each animation frame, before drawing...
 *     engine.clear()
 *
 *     // When no longer needed, usually in the window.onunload function...
 *     engine.release()
 */
export class Engine extends ShareableBase implements VertexBufferManager {

    /**
     * 
     */
    private _gl: WebGLRenderingContext

    private _attributes: WebGLContextAttributes

    // Remark: We only hold weak references to users so that the lifetime of resource
    // objects is not affected by the fact that they are listening for gl events.
    // Users should automatically add themselves upon construction and remove upon release.
    private _users: ContextConsumer[] = []

    private _webGLContextLost: (event: Event) => any
    private _webGLContextRestored: (event: Event) => any

    private _commands = new ShareableArray<ContextConsumer>([])

    /**
     * The argument provided in contextGain events.
     */
    private _contextProvider: DefaultContextProvider

    /**
     * @param attributes Allows the context to be configured.
     */
    constructor(attributes?: WebGLContextAttributes) {
        super()
        this.setLoggingName('Engine')

        this._attributes = attributes;

        this._commands.pushWeakRef(new EIGHTLogger())
        this._commands.pushWeakRef(new VersionLogger())

        this._contextProvider = new DefaultContextProvider(this)

        this._webGLContextLost = (event: Event) => {
            if (isDefined(this._gl)) {
                event.preventDefault()
                this._gl = void 0
                this._users.forEach((user: ContextConsumer) => {
                    user.contextLost()
                })
            }
        }

        this._webGLContextRestored = (event: Event) => {
            if (isDefined(this._gl)) {
                event.preventDefault()
                this._gl = initWebGL(this._gl.canvas, attributes)
                this._users.forEach((user: ContextConsumer) => {
                    user.contextGain(this._contextProvider)
                })
            }
        }
    }

    /**
     *
     */
    protected destructor(levelUp: number): void {
        this.stop();
        this._contextProvider.release()
        while (this._users.length > 0) {
            this._users.pop();
        }
        this._commands.release();
        super.destructor(levelUp + 1)
    }

    /**
     *
     */
    addContextListener(user: ContextConsumer): void {
        mustBeObject('user', user)
        const index = this._users.indexOf(user)
        if (index < 0) {
            this._users.push(user)
        }
        else {
            console.warn("user already exists for addContextListener")
        }
    }

    /**
     * The canvas element associated with the WebGLRenderingContext.
     */
    get canvas(): HTMLCanvasElement {
        if (this._gl) {
            return this._gl.canvas;
        }
        else {
            return void 0;
        }
    }

    /**
     * <p>
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     * <p>
     *
     * @param red
     * @param green
     * @param blue
     * @param alpha
     */
    clearColor(red: number, green: number, blue: number, alpha: number): Engine {
        this._commands.pushWeakRef(new WebGLClearColor(red, green, blue, alpha))
        const gl = this._gl
        if (gl) {
            gl.clearColor(red, green, blue, alpha)
        }
        return this
    }

    /**
     * Disables the specified WebGL capability.
     */
    disable(capability: Capability): Engine {
        this._commands.pushWeakRef(new WebGLDisable(capability));
        if (this._gl) {
            this._gl.disable(capability);
        }
        return this;
    }

    /**
     * Enables the specified WebGL capability.
     */
    enable(capability: Capability): Engine {
        this._commands.pushWeakRef(new WebGLEnable(capability));
        if (this._gl) {
            this._gl.enable(capability);
        }
        return this;
    }

    /**
     * The underlying WebGL rendering context.
     */
    get gl(): WebGLRenderingContext {
        if (this._gl) {
            return this._gl
        }
        else {
            return void 0
        }
    }

    /**
     * @param user
     */
    removeContextListener(user: ContextConsumer): void {
        mustBeObject('user', user)
        const index = this._users.indexOf(user)
        if (index >= 0) {
            this._users.splice(index, 1)
        }
    }

    blendFunc(sfactor: BlendingFactorSrc, dfactor: BlendingFactorDest): void {
        const gl = this._gl
        if (gl) {
            gl.blendFunc(sfactor, dfactor)
        }
    }

    /**
     * <p>
     * Sets the graphics buffers to values preselected by clearColor, clearDepth or clearStencil.
     * </p>
     */
    clear(mask = ClearBufferMask.COLOR_BUFFER_BIT | ClearBufferMask.DEPTH_BUFFER_BIT): void {
        const gl = this._gl
        if (gl) {
            gl.clear(mask)
        }
    }

    depthFunc(func: DepthFunction): void {
        const gl = this._gl
        if (gl) {
            gl.depthFunc(func)
        }
    }

    /**
     * <p>
     * The viewport width and height are clamped to a range that is
     * implementation dependent.
     * </p>
     *
     * @returns e.g. Int32Array[16384, 16384]
     */
    getMaxViewportDims(): Int32Array {
        const gl = this._gl
        if (gl) {
            return gl.getParameter(gl.MAX_VIEWPORT_DIMS)
        }
        else {
            return void 0
        }
    }

    /**
     * <p>
     * Returns the current viewport settings.
     * </p>
     *
     * @returns e.g. Int32Array[x, y, width, height]
     */
    getViewport(): Int32Array {
        const gl = this._gl
        if (gl) {
            return gl.getParameter(gl.VIEWPORT)
        }
        else {
            return void 0
        }
    }

    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     *
     * @param x
     * @param y
     * @param width
     * @param height
     */
    viewport(x: number, y: number, width: number, height: number): Engine {
        const gl = this._gl;
        if (gl) {
            gl.viewport(x, y, width, height)
        }
        else {
            if (config.errorMode === ErrorMode.WARNME) {
                console.warn(`${this._type}.viewport(${x}, ${y}, ${width}, ${height}) ignored because no context.`)
            }
        }
        return this
    }

    /**
     * Initializes the <code>WebGLRenderingContext</code> for the specified <code>HTMLCanvasElement</code>.
     *
     * @param canvas The HTML canvas element or canvas element identifier.
     * @param doc The document object model that contains the canvas identifier.
     */
    start(canvas: string | HTMLCanvasElement, doc = window.document): Engine {
        if (typeof canvas === 'string') {
            const canvasElement = <HTMLCanvasElement>doc.getElementById(canvas);
            if (canvasElement) {
                return this.start(canvasElement, doc);
            }
            else {
                throw new Error("canvas argument must be a canvas element id or an HTMLCanvasElement.");
            }
        }
        else if (canvas instanceof HTMLCanvasElement) {
            if (isDefined(this._gl)) {
                // We'll just be idempotent and ignore the call because we've already been started.
                // To use the canvas might conflict with one we have dynamically created.
                console.warn(`${this._type} Ignoring start() because already started.`)
                return
            }
            else {
                this._gl = initWebGL(canvas, this._attributes);
                checkEnums(this._gl);
                this.emitStartEvent();
                canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
            }
            return this;
        }
        else {
            console.warn("canvas must be an HTMLCanvasElement to start the context.");
            return this;
        }
    }

    /**
     *
     */
    stop(): Engine {
        if (isDefined(this._gl)) {
            this._gl.canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false)
            this._gl.canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false)
            if (this._gl) {
                this.emitStopEvent()
                this._gl = void 0
            }
        }
        return this
    }

    private emitStartEvent() {
        this._users.forEach((user: ContextConsumer) => {
            this.emitContextGain(user)
        })
        this._commands.forEach((command) => {
            this.emitContextGain(command)
        })
    }

    private emitContextGain(consumer: ContextConsumer): void {
        if (this._gl.isContextLost()) {
            consumer.contextLost()
        }
        else {
            consumer.contextGain(this._contextProvider)
        }
    }

    private emitStopEvent() {
        this._users.forEach((user: ContextConsumer) => {
            this.emitContextFree(user)
        })
        this._commands.forEach((command) => {
            this.emitContextFree(command);
        })
    }

    private emitContextFree(consumer: ContextConsumer): void {
        if (this._gl.isContextLost()) {
            consumer.contextLost()
        }
        else {
            consumer.contextFree(this._contextProvider)
        }
    }

    /**
     * @param consumer
     */
    synchronize(consumer: ContextConsumer): void {
        if (this._gl) {
            this.emitContextGain(consumer)
        }
        else {
            // FIXME: Broken symmetry.
        }
    }
}