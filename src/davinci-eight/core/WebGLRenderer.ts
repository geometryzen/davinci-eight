import Capability from '../commands/Capability';
import core from '../core';
import IContextProvider from './IContextProvider';
import IContextConsumer from './IContextConsumer';
import ShareableArray from '../collections/ShareableArray';
import initWebGL from './initWebGL';
import isDefined from '../checks/isDefined';
import mustBeDefined from '../checks/mustBeDefined';
import mustBeObject from '../checks/mustBeObject';
import readOnly from '../i18n/readOnly';
import Shareable from './Shareable';
import WebGLClearColor from '../commands/WebGLClearColor';
import WebGLEnable from '../commands/WebGLEnable';
import WebGLDisable from '../commands/WebGLDisable';

/**
 * Fundamental abstractions in the architecture.
 *
 * @module EIGHT
 * @submodule core
 */

class WebGLContextProvider extends Shareable implements IContextProvider {
    private _renderer: WebGLRenderer

    constructor(renderer: WebGLRenderer) {
        super('WebGLContextProvider')
        this._renderer = renderer
    }
    protected destructor(): void {
        super.destructor()
    }
    get gl() {
        return this._renderer.gl
    }
    set gl(unused) {
        throw new Error(readOnly('gl').message)
    }
}

/**
 * @class WebGLRenderer
 * @extends Shareable
 */
export default class WebGLRenderer extends Shareable {

    /**
     * @property _gl
     * @type WebGLRenderingContext
     * @private
     */
    private _gl: WebGLRenderingContext

    /**
     * @property _canvas
     * @type HTMLCanvasElement
     * @private
     */
    private _canvas: HTMLCanvasElement

    private _attributes: WebGLContextAttributes

    // Remark: We only hold weak references to users so that the lifetime of resource
    // objects is not affected by the fact that they are listening for gl events.
    // Users should automatically add themselves upon construction and remove upon release.
    // // FIXME: Really? Not ShareableArray<IIContextConsumer> ?
    private _users: IContextConsumer[] = []

    private _webGLContextLost: (event: Event) => any
    private _webGLContextRestored: (event: Event) => any

    private _commands = new ShareableArray<IContextConsumer>([])

    private _contextProvider: WebGLContextProvider

    /**
     * @class WebGLRenderer
     * @constructor
     * @param [attributes] {WebGLContextAttributes} Allow the context to be configured.
     */
    constructor(attributes?: WebGLContextAttributes) {
        super('WebGLRenderer')

        this._attributes = attributes;

        this._contextProvider = new WebGLContextProvider(this)

        // For convenience.
        this.enable(Capability.DEPTH_TEST);

        this._webGLContextLost = (event: Event) => {
            if (isDefined(this._canvas)) {
                event.preventDefault()
                this._gl = void 0
                this._users.forEach((user: IContextConsumer) => {
                    user.contextLost()
                })
            }
        }

        this._webGLContextRestored = (event: Event) => {
            if (isDefined(this._canvas)) {
                event.preventDefault()
                this._gl = initWebGL(this._canvas, attributes)
                this._users.forEach((user: IContextConsumer) => {
                    user.contextGain(this._contextProvider)
                })
            }
        }
    }

    /**
     * @method destructor
     * return {void}
     * @protected
     */
    protected destructor(): void {
        this.stop();
        this._contextProvider.release()
        while (this._users.length > 0) {
            this._users.pop();
        }
        this._commands.release();
        super.destructor()
    }

    /**
     * @method addContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    addContextListener(user: IContextConsumer): void {
        mustBeObject('user', user)
        let index = this._users.indexOf(user)
        if (index < 0) {
            this._users.push(user)
        }
        else {
            console.warn("user already exists for addContextListener")
        }
    }

    /**
     * @property canvas
     * @type {HTMLCanvasElement}
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
     * @property commands
     * @type {ShareableArray}
     * @beta
     * @readOnly
     */
    get commands(): ShareableArray<IContextConsumer> {
        this._commands.addRef();
        return this._commands;
    }
    set commands(unused) {
        throw new Error(readOnly('commands').message)
    }

    /**
     * <p>
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     * <p>
     * @method clearColor
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @param alpha {number}
     * @return {WebGLRenderer}
     * @chainable
     */
    clearColor(red: number, green: number, blue: number, alpha: number): WebGLRenderer {
        this._commands.pushWeakRef(new WebGLClearColor(red, green, blue, alpha))
        if (this._gl) {
            this._gl.clearColor(red, green, blue, alpha)
        }
        return this
    }

    /**
     * Turns off specific WebGL capabilities for this context.
     * @method disable
     * @param capability {Capability}
     * @return {WebGLRenderer}
     * @chainable
     */
    disable(capability: Capability): WebGLRenderer {
        this._commands.pushWeakRef(new WebGLDisable(capability))
        return this
    }

    /**
     * Turns on specific WebGL capabilities for this context.
     * @method enable
     * @param capability {Capability}
     * @return {WebGLRenderer}
     * @chainable
     */
    enable(capability: Capability): WebGLRenderer {
        this._commands.pushWeakRef(new WebGLEnable(capability))
        return this
    }

    /**
     * @property gl
     * @type {WebGLRenderingContext}
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
     * @method removeContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    removeContextListener(user: IContextConsumer): void {
        mustBeObject('user', user)
        const index = this._users.indexOf(user)
        if (index >= 0) {
            this._users.splice(index, 1)
        }
    }

    /**
     * @method clear
     * @return {void}
     */
    clear(): void {
        const gl = this._gl
        if (gl) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        }
    }

    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     * @method viewport
     * @param x {number}
     * @param y {number}
     * @param width {number}
     * @param height {number}
     * @return {WebGLRenderer}
     * @chainable
     */
    viewport(x: number, y: number, width: number, height: number): WebGLRenderer {
        const gl = this._gl;
        if (gl) {
            this._gl.viewport(x, y, width, height)
        }
        else {
            console.warn(`${this._type}.viewport() ignored because no context.`)
        }
        return this
    }

    /**
     * Initializes the WebGL context for the specified <code>canvas</code>.
     * @method start
     * @param canvas {HTMLCanvasElement} The HTML canvas element.
     * @return {WebGLRenderer}
     * @chainable
     */
    start(canvas: HTMLCanvasElement): WebGLRenderer {
        if (!(canvas instanceof HTMLCanvasElement)) {
            console.warn("canvas must be an HTMLCanvasElement to start the context.")
            return this
        }
        mustBeDefined('canvas', canvas)
        const alreadyStarted = isDefined(this._canvas)
        if (!alreadyStarted) {
            // cache the arguments
            this._canvas = canvas
        }
        else {
            // We'll just be idempotent and ignore the call because we've already been started.
            // To use the canvas might conflict with one we have dynamically created.
            if (core.verbose) {
                console.warn(`${this._type} Ignoring start() because already started.`)
            }
            return
        }
        // What if we were given a "no-op" canvasBuilder that returns undefined for the canvas.
        // To not complain is the way of the hyper-functional warrior.
        if (isDefined(this._canvas)) {
            this._gl = initWebGL(this._canvas, this._attributes);
            this.emitStartEvent()
            this._canvas.addEventListener('webglcontextlost', this._webGLContextLost, false)
            this._canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false)
        }
        return this
    }

    /**
     * @method stop
     * @return {WebGLRenderer}
     * @chainable
     */
    stop(): WebGLRenderer {
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
        this._users.forEach((user: IContextConsumer) => {
            this.emitContextGain(user)
        })
        this._commands.forEach((command) => {
            this.emitContextGain(command)
        })
    }

    private emitContextGain(consumer: IContextConsumer): void {
        if (this._gl.isContextLost()) {
            consumer.contextLost()
        }
        else {
            consumer.contextGain(this._contextProvider)
        }
    }

    private emitStopEvent() {
        this._users.forEach((user: IContextConsumer) => {
            this.emitContextFree(user)
        })
        this._commands.forEach((command) => {
            this.emitContextFree(command);
        })
    }

    private emitContextFree(consumer: IContextConsumer): void {
        if (this._gl.isContextLost()) {
            consumer.contextLost()
        }
        else {
            consumer.contextFree(this._contextProvider)
        }
    }

    /**
     * @method synchronize
     * @param consumer {IContextConsumer}
     * @return {void}
     */
    synchronize(consumer: IContextConsumer): void {
        if (this._gl) {
            this.emitContextGain(consumer)
        }
        else {
            // FIXME: Broken symmetry.
        }
    }
}