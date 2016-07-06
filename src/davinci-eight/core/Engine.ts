import BeginMode from './BeginMode';
import BlendingFactorDest from './BlendingFactorDest';
import BlendingFactorSrc from './BlendingFactorSrc';
import Capability from './Capability';
import ClearBufferMask from './ClearBufferMask';
import DepthFunction from './DepthFunction';
import config from '../config'
import EIGHTLogger from '../commands/EIGHTLogger';
import ErrorMode from './ErrorMode';
import {ContextConsumer} from './ContextConsumer';
import DefaultContextProvider from '../base/DefaultContextProvider';
import initWebGL from './initWebGL';
import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeEQ from '../checks/mustBeEQ';
import mustBeObject from '../checks/mustBeObject';
import readOnly from '../i18n/readOnly';
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
 *     const renderer = new EIGHT.Engine()
 *
 *     // When the canvas is available, usually in the window.onload function...
 *     renderer.start(canvas)
 *
 *     // At the start of each animation frame, before drawing...
 *     renderer.clear()
 *
 *     // When no longer needed, usually in the window.onunload function...
 *     renderer.release()
 */
export class Engine extends ShareableBase implements VertexBufferManager {

    /**
     * 
     */
    private _gl: WebGLRenderingContext

    /**
     * FIXME: The WebGLRenderingContext has a canvas property already.
     */
    private _canvas: HTMLCanvasElement

    private _attributes: WebGLContextAttributes

    // Remark: We only hold weak references to users so that the lifetime of resource
    // objects is not affected by the fact that they are listening for gl events.
    // Users should automatically add themselves upon construction and remove upon release.
    private _users: ContextConsumer[] = []

    private _webGLContextLost: (event: Event) => any
    private _webGLContextRestored: (event: Event) => any

    private _commands = new ShareableArray<ContextConsumer>([])

    private _contextProvider: DefaultContextProvider

    private _mayUseCache = true

    /**
     * A cache of the parameters used in the last gl.viewport method call.
     * width and height must be positive so this cache is initially dirty.
     */
    private _viewportArgs: { x: number; y: number; width: number, height: number } = {
        x: void 0,
        y: void 0,
        width: void 0,
        height: void 0
    }

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
            if (isDefined(this._canvas)) {
                event.preventDefault()
                this._gl = void 0
                this._users.forEach((user: ContextConsumer) => {
                    user.contextLost()
                })
            }
        }

        this._webGLContextRestored = (event: Event) => {
            if (isDefined(this._canvas)) {
                event.preventDefault()
                this._gl = initWebGL(this._canvas, attributes)
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
     * @readOnly
     */
    get canvas(): HTMLCanvasElement {
        // FIXME: Retract this implicit starting behavior.
        if (!this._canvas) {
            this.start(document.createElement('canvas'))
        }
        return this._canvas;
    }
    set canvas(canvas: HTMLCanvasElement) {
        throw new Error(readOnly('canvas').message)
    }

    /**
     * @readOnly
     */
    get commands(): ShareableArray<ContextConsumer> {
        this._commands.addRef();
        return this._commands;
    }
    set commands(unused) {
        throw new Error(readOnly('commands').message)
    }

    /**
     * <p>
     * Determines whether this <code>Engine</code> may use a cache to optimize
     * <code>WebGLREnderingContext</code> calls.
     * </p>
     * <p>
     * The default value of this property is <code>true</code>.
     * Set this property to <code>false</code> if the WebGL API is being called
     * directly (not through <code>Engine</code>).
     * </p>
     *
     * @default true
     */
    get mayUseCache(): boolean {
        return this._mayUseCache
    }
    set mayUseCache(mayUseCache: boolean) {
        this._mayUseCache = mustBeBoolean('mayUseCache', mayUseCache)
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

    disable(capability: Capability): Engine {
        this._commands.pushWeakRef(new WebGLDisable(capability));
        if (this._gl) {
            this._gl.disable(capability);
        }
        return this;
    }

    enable(capability: Capability): Engine {
        this._commands.pushWeakRef(new WebGLEnable(capability));
        if (this._gl) {
            this._gl.enable(capability);
        }
        return this;
    }

    /**
     * @readOnly
     */
    get gl(): WebGLRenderingContext {
        if (this._gl) {
            return this._gl
        }
        else {
            return void 0
        }
    }
    set gl(unused) {
        throw new Error(readOnly('gl').message)
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
            if (this._mayUseCache) {
                const args = this._viewportArgs;
                if (x !== args.x || y !== args.y || width !== args.width || height !== args.height) {
                    gl.viewport(x, y, width, height)
                    args.x = x
                    args.y = y
                    args.width = width
                    args.height = height
                }
            }
            else {
                gl.viewport(x, y, width, height)
            }
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
     * @param canvas The HTML canvas element.
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
            const alreadyStarted = isDefined(this._canvas)
            if (!alreadyStarted) {
                // cache the arguments
                this._canvas = canvas
            }
            else {
                // We'll just be idempotent and ignore the call because we've already been started.
                // To use the canvas might conflict with one we have dynamically created.
                console.warn(`${this._type} Ignoring start() because already started.`)
                return
            }
            // What if we were given a "no-op" canvasBuilder that returns undefined for the canvas.
            // To not complain is the way of the hyper-functional warrior.
            if (isDefined(this._canvas)) {
                this._gl = initWebGL(this._canvas, this._attributes);
                checkEnums(this._gl);
                this.emitStartEvent();
                this._canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
                this._canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
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
        if (isDefined(this._canvas)) {
            this._canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false)
            this._canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false)
            if (this._gl) {
                this.emitStopEvent()
                this._gl = void 0
            }
            this._canvas = void 0
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

/**
 * Verify that the enums match the values in the WebGL rendering context.
 */
function checkEnums(gl: WebGLRenderingContext): void {

    // BeginMode
    mustBeEQ('LINE_LOOP', BeginMode.LINE_LOOP, gl.LINE_LOOP);
    mustBeEQ('LINE_STRIP', BeginMode.LINE_STRIP, gl.LINE_STRIP);
    mustBeEQ('LINES', BeginMode.LINES, gl.LINES);
    mustBeEQ('POINTS', BeginMode.POINTS, gl.POINTS);
    mustBeEQ('TRIANGLE_FAN', BeginMode.TRIANGLE_FAN, gl.TRIANGLE_FAN);
    mustBeEQ('TRIANGLE_STRIP', BeginMode.TRIANGLE_STRIP, gl.TRIANGLE_STRIP);
    mustBeEQ('TRIANGLES', BeginMode.TRIANGLES, gl.TRIANGLES);

    // BlendingFactorDest
    mustBeEQ('ZERO', BlendingFactorDest.ZERO, gl.ZERO);
    mustBeEQ('ONE', BlendingFactorDest.ONE, gl.ONE);
    mustBeEQ('SRC_COLOR', BlendingFactorDest.SRC_COLOR, gl.SRC_COLOR);
    mustBeEQ('ONE_MINUS_SRC_COLOR', BlendingFactorDest.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_COLOR);
    mustBeEQ('SRC_ALPHA', BlendingFactorDest.SRC_ALPHA, gl.SRC_ALPHA);
    mustBeEQ('ONE_MINUS_SRC_ALPHA', BlendingFactorDest.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    mustBeEQ('DST_ALPHA', BlendingFactorDest.DST_ALPHA, gl.DST_ALPHA);
    mustBeEQ('ONE_MINUS_DST_ALPHA', BlendingFactorDest.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);

    // BlendingFactorSrc
    mustBeEQ('ZERO', BlendingFactorSrc.ZERO, gl.ZERO);
    mustBeEQ('ONE', BlendingFactorSrc.ONE, gl.ONE);
    mustBeEQ('DST_COLOR', BlendingFactorSrc.DST_COLOR, gl.DST_COLOR);
    mustBeEQ('ONE_MINUS_DST_COLOR', BlendingFactorSrc.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_DST_COLOR);
    mustBeEQ('SRC_ALPHA_SATURATE', BlendingFactorSrc.SRC_ALPHA_SATURATE, gl.SRC_ALPHA_SATURATE);
    mustBeEQ('SRC_ALPHA', BlendingFactorSrc.SRC_ALPHA, gl.SRC_ALPHA);
    mustBeEQ('ONE_MINUS_SRC_ALPHA', BlendingFactorSrc.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    mustBeEQ('DST_ALPHA', BlendingFactorSrc.DST_ALPHA, gl.DST_ALPHA);
    mustBeEQ('ONE_MINUS_DST_ALPHA', BlendingFactorSrc.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);

    // Capability
    mustBeEQ('CULL_FACE', Capability.CULL_FACE, gl.CULL_FACE);
    mustBeEQ('BLEND', Capability.BLEND, gl.BLEND);
    mustBeEQ('DITHER', Capability.DITHER, gl.DITHER);
    mustBeEQ('STENCIL_TEST', Capability.STENCIL_TEST, gl.STENCIL_TEST);
    mustBeEQ('DEPTH_TEST', Capability.DEPTH_TEST, gl.DEPTH_TEST);
    mustBeEQ('SCISSOR_TEST', Capability.SCISSOR_TEST, gl.SCISSOR_TEST);
    mustBeEQ('POLYGON_OFFSET_FILL', Capability.POLYGON_OFFSET_FILL, gl.POLYGON_OFFSET_FILL);
    mustBeEQ('SAMPLE_ALPHA_TO_COVERAGE', Capability.SAMPLE_ALPHA_TO_COVERAGE, gl.SAMPLE_ALPHA_TO_COVERAGE);
    mustBeEQ('SAMPLE_COVERAGE', Capability.SAMPLE_COVERAGE, gl.SAMPLE_COVERAGE);

    // ClearBufferMask
    mustBeEQ('COLOR_BUFFER_BIT', ClearBufferMask.COLOR_BUFFER_BIT, gl.COLOR_BUFFER_BIT);
    mustBeEQ('DEPTH_BUFFER_BIT', ClearBufferMask.DEPTH_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
    mustBeEQ('STENCIL_BUFFER_BIT', ClearBufferMask.STENCIL_BUFFER_BIT, gl.STENCIL_BUFFER_BIT);

    // DepthFunction
    mustBeEQ('ALWAYS', DepthFunction.ALWAYS, gl.ALWAYS);
    mustBeEQ('EQUAL', DepthFunction.EQUAL, gl.EQUAL);
    mustBeEQ('GEQUAL', DepthFunction.GEQUAL, gl.GEQUAL);
    mustBeEQ('GREATER', DepthFunction.GREATER, gl.GREATER);
    mustBeEQ('LEQUAL', DepthFunction.LEQUAL, gl.LEQUAL);
    mustBeEQ('LESS', DepthFunction.LESS, gl.LESS);
    mustBeEQ('NEVER', DepthFunction.NEVER, gl.NEVER);
    mustBeEQ('NOTEQUAL', DepthFunction.NOTEQUAL, gl.NOTEQUAL);
}
