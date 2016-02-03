import Capability from '../commands/Capability';
import Facet from '../core/Facet';
import createRenderer from '../renderers/renderer';
import ContextController from '../core/ContextController';
import ContextKahuna from '../core/ContextKahuna';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IContextConsumer from '../core/IContextConsumer';
import contextProxy from '../utils/contextProxy';
import IContextRenderer from '../renderers/IContextRenderer';
import IBuffer from '../core/IBuffer';
import IContextCommand from '../core/IContextCommand';
import IBufferGeometry from '../geometries/IBufferGeometry';
import IDrawList from '../scene/IDrawList';
import ITexture2D from '../core/ITexture2D';
import ITextureCubeMap from '../core/ITextureCubeMap';
import IUnknownArray from '../collections/IUnknownArray';
import mustBeDefined from '../checks/mustBeDefined';
import Primitive from '../geometries/Primitive';
import readOnly from '../i18n/readOnly';
import Shareable from '../utils/Shareable';

/**
 * @class WebGLRenderer
 * @extends Shareable
 */
export default class WebGLRenderer extends Shareable implements ContextController, IContextProvider, IContextMonitor, IContextRenderer {
    /**
     * @property _kahuna
     * @type {ContextKahuna}
     * @private
     */
    private _kahuna: ContextKahuna;

    /**
     * @property _renderer
     * @type {IContextRenderer}
     * @private
     */
    private _renderer: IContextRenderer;

    /**
     * @class WebGLRenderer
     * @constructor
     * @param [attributes] {WebGLContextAttributes} Allow the context to be configured.
     */
    constructor(attributes?: WebGLContextAttributes) {
        super('WebGLRenderer');
        this._kahuna = contextProxy(attributes);
        this._renderer = createRenderer();
        this._kahuna.addContextListener(this._renderer);
        this._kahuna.synchronize(this._renderer);
        this.enable(Capability.DEPTH_TEST);
    }

    /**
     * @method destructor
     * return {void}
     * @protected
     */
    protected destructor(): void {
        this._kahuna.removeContextListener(this._renderer)
        this._kahuna.release()
        this._kahuna = void 0
        this._renderer.release()
        this._renderer = void 0
        super.destructor()
    }

    /**
     * @method addContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    addContextListener(user: IContextConsumer): void {
        this._kahuna.addContextListener(user)
    }

    /**
     * @property canvas
     * @type {HTMLCanvasElement}
     */
    get canvas(): HTMLCanvasElement {
        return this._kahuna.canvas;
    }
    set canvas(canvas: HTMLCanvasElement) {
        this._kahuna.canvas = canvas;
    }

    /**
     * @property canvasId
     * @type {number}
     * @readOnly
     */
    get canvasId(): number {
        return this._kahuna.canvasId;
    }
    set canvasId(unused) {
        // FIXME: DRY delegate to kahuna? Should give the same result.
        throw new Error(readOnly('canvasId').message)
    }

    /**
     * @property commands
     * @type {IUnknownArray}
     * @beta
     * @readOnly
     */
    get commands(): IUnknownArray<IContextCommand> {
        return this._renderer.commands;
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
        this._renderer.clearColor(red, green, blue, alpha)
        return this
    }

    /**
     * @method contextFree
     * @param [canvasId] {number}
     * @return {void}
     */
    contextFree(canvasId: number): void {
        return this._renderer.contextFree(canvasId)
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        return this._renderer.contextGain(manager)
    }

    /**
     * @method contextLost
     * @param [canvasId] {number}
     * @return {void}
     */
    contextLost(canvasId: number) {
        this._renderer.contextLost(canvasId)
    }

    /**
     * @method createArrayBuffer
     * @return {IBuffer}
     */
    createArrayBuffer(): IBuffer {
        return this._kahuna.createArrayBuffer()
    }

    /**
     * @method createBufferGeometry
     * @param primitive {Primitive}
     * @param [usage] {number}
     * @return {IBufferGeometry}
     */
    createBufferGeometry(primitive: Primitive, usage?: number): IBufferGeometry {
        return this._kahuna.createBufferGeometry(primitive, usage)
    }

    /**
     * @method createElementArrayBuffer
     * @return {IBuffer}
     */
    createElementArrayBuffer(): IBuffer {
        return this._kahuna.createElementArrayBuffer()
    }

    /**
     * @method createTextureCubeMap
     * @return {ITextureCubeMap}
     */
    createTextureCubeMap(): ITextureCubeMap {
        return this._kahuna.createTextureCubeMap()
    }

    /**
     * @method createTexture2D
     * @return {ITexture2D}
     */
    createTexture2D(): ITexture2D {
        return this._kahuna.createTexture2D()
    }

    /**
     * Turns off specific WebGL capabilities for this context.
     * @method disable
     * @param capability {Capability}
     * @return {WebGLRenderer}
     * @chainable
     */
    disable(capability: Capability): WebGLRenderer {
        this._renderer.disable(capability)
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
        this._renderer.enable(capability)
        return this
    }

    /**
     * @property gl
     * @type {WebGLRenderingContext}
     * @readOnly
     */
    get gl(): WebGLRenderingContext {
        return this._kahuna.gl
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
        return this._kahuna.removeContextListener(user)
    }

    /**
     * @method render
     * @param drawList {IDrawList}
     * @param ambients {Facet[]}
     * @return {void}
     */
    render(drawList: IDrawList, ambients: Facet[]): void {
        return this._renderer.render(drawList, ambients);
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
        this._renderer.viewport(x, y, width, height)
        return this
    }

    /**
     * Initializes the WebGL context for the specified <code>canvas</code>.
     * @method start
     * @param canvas {HTMLCanvasElement} The HTML canvas element.
     * @param [canvasId] {number} An optional user-defined alias for the canvas when using multi-canvas.
     * @return {WebGLRenderer}
     * @chainable
     */
    start(canvas: HTMLCanvasElement, canvasId: number): WebGLRenderer {
        // FIXME: DRY delegate to kahuna.
        if (!(canvas instanceof HTMLCanvasElement)) {
            console.warn("canvas must be an HTMLCanvasElement to start the context.")
            return this
        }
        mustBeDefined('canvas', canvas)
        this._kahuna.start(canvas, canvasId)
        return this
    }

    /**
     * @method stop
     * @return {WebGLRenderer}
     * @chainable
     */
    stop(): WebGLRenderer {
        this._kahuna.stop()
        return this
    }

    /**
     * @method synchronize
     * @param consumer {IContextConsumer}
     * @return {void}
     */
    synchronize(consumer: IContextConsumer): void {
        return this._kahuna.synchronize(consumer)
    }
}
