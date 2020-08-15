import { isDefined } from '../checks/isDefined';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeLE } from '../checks/mustBeLE';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeString } from '../checks/mustBeString';
import { ShareableArray } from '../collections/ShareableArray';
import { EIGHTLogger } from '../commands/EIGHTLogger';
import { VersionLogger } from '../commands/VersionLogger';
import { WebGLClearColor } from '../commands/WebGLClearColor';
import { WebGLDisable } from '../commands/WebGLDisable';
import { WebGLEnable } from '../commands/WebGLEnable';
import { R3, vectorFromCoords } from '../math/R3';
import { BlendingFactorDest } from './BlendingFactorDest';
import { BlendingFactorSrc } from './BlendingFactorSrc';
import { Capability } from './Capability';
import { checkEnums } from './checkEnums';
import { ClearBufferMask } from './ClearBufferMask';
import { ContextConsumer } from './ContextConsumer';
import { ContextManager } from './ContextManager';
import { DepthFunction } from './DepthFunction';
import { Geometry } from './Geometry';
import { GeometryKey } from './GeometryKey';
import { initWebGL } from './initWebGL';
import { Material } from './Material';
import { MaterialKey } from './MaterialKey';
import { PixelFormat } from './PixelFormat';
import { PixelType } from './PixelType';
import { ShareableBase } from './ShareableBase';
import { mustBeWebGLContextId } from '../checks/mustBeWebGLContextId';

export interface EngineAttributes extends WebGLContextAttributes {
    /**
     * Determines the WebGL context identifier used to get the context from the canvas element.
     */
    contextId?: 'webgl2' | 'webgl';
    /**
     * Determines whether the Engine logs the version of the library to the console.
     */
    eightLogging?: boolean;
    /**
     * Determines whether the Engine logs the version of WebGL to the console.
     */
    webglLogging?: boolean;
}

function getWindowDocument(window: Window): Document {
    if (window) {
        return window.document;
    }
    else {
        return void 0;
    }
}

/**
 * A wrapper around an HTMLCanvasElement providing access to the WebGLRenderingContext
 * and notifications of context loss and restore. An instance of the Engine will usually
 * be a required parameter for any consumer of WebGL resources.
 * 
 * <iframe
 *     title="Engine"
 *     width="860"
 *     height="600"
 *     src="https://www.stemcstudio.com/gists/54644519dcd556bf8bf779bfa084ced3?embed&file=main.ts&hideREADME">
 * </iframe>
 *
 */
export class Engine extends ShareableBase implements ContextManager {
    /**
     * 
     */
    private _gl: WebGL2RenderingContext | WebGLRenderingContext;
    private _contextId: 'webgl2' | 'webgl';
    private _overrideContextId: 'webgl2' | 'webgl' | undefined;
    /**
     * 
     */
    private _attributes: WebGLContextAttributes;
    // Remark: We only hold weak references to users so that the lifetime of resource
    // objects is not affected by the fact that they are listening for gl events.
    // Users should automatically add themselves upon construction and remove upon release.
    private _users: ContextConsumer[] = [];
    /**
     * 
     */
    private _webGLContextLost: (event: Event) => any;
    /**
     * 
     */
    private _webGLContextRestored: (event: Event) => any;
    /**
     * Actions that are executed when a WebGL rendering context is gained.
     */
    private _commands = new ShareableArray<ContextConsumer>([]);
    /**
     * The cache of Geometry.
     */
    private geometries: { [name: string]: Geometry } = {};
    /**
     * The cache of Material.
     */
    private materials: { [name: string]: Material } = {};
    /**
     * @param canvas 
     * @param attributes Allows the context to be configured.
     * @param doc The document object model that contains the canvas identifier.
     */
    constructor(canvas?: string | HTMLCanvasElement | WebGL2RenderingContext, attributes: EngineAttributes = {}, doc = getWindowDocument(window)) {
        super();
        this.setLoggingName('Engine');

        // TODO: Defensive copy and strip off the extra attributes on EngineAttributes just in case the WebGL runtime gets strict and complains.
        this._attributes = attributes;
        if (isDefined(attributes.contextId)) {
            this._overrideContextId = mustBeWebGLContextId("attributes.contextId", attributes.contextId);
        }

        if (attributes.eightLogging) {
            this._commands.pushWeakRef(new EIGHTLogger());
        }
        if (attributes.webglLogging) {
            this._commands.pushWeakRef(new VersionLogger(this));
        }

        this._webGLContextLost = (event: Event) => {
            if (isDefined(this._gl)) {
                event.preventDefault();
                this._gl = void 0;
                this._users.forEach((user: ContextConsumer) => {
                    user.contextLost();
                });
            }
        };

        this._webGLContextRestored = (event: Event) => {
            if (isDefined(this._gl)) {
                if (this._gl.canvas instanceof HTMLCanvasElement) {
                    event.preventDefault();
                    const result = initWebGL(this._gl.canvas, attributes, this._overrideContextId);
                    this._gl = checkEnums(result.context);
                    this._contextId = result.contextId;
                    this._users.forEach((user: ContextConsumer) => {
                        user.contextGain();
                    });
                }
                else {
                    // 
                }
            }
        };

        if (canvas) {
            this.start(canvas, doc);
        }
    }

    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('Engine');
        this._commands = new ShareableArray<ContextConsumer>([]);
    }

    /**
     *
     */
    protected destructor(levelUp: number): void {
        this.stop();
        while (this._users.length > 0) {
            this._users.pop();
        }
        this._commands.release();
        super.destructor(levelUp + 1);
    }

    /**
     *
     */
    addContextListener(user: ContextConsumer): void {
        mustBeNonNullObject('user', user);
        const index = this._users.indexOf(user);
        if (index < 0) {
            this._users.push(user);
        }
        else {
            console.warn("user already exists for addContextListener");
        }
    }

    /**
     * The canvas element associated with the WebGLRenderingContext.
     */
    get canvas(): HTMLCanvasElement {
        if (this._gl) {
            if (this._gl.canvas instanceof HTMLCanvasElement) {
                return this._gl.canvas;
            }
            else {
                // OffscreenCanvas or undefined.
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }

    get drawingBufferHeight(): number {
        if (this._gl) {
            return this._gl.drawingBufferHeight;
        }
        else {
            return void 0;
        }
    }

    get drawingBufferWidth(): number {
        if (this._gl) {
            return this._gl.drawingBufferWidth;
        }
        else {
            return void 0;
        }
    }

    blendFunc(sfactor: BlendingFactorSrc, dfactor: BlendingFactorDest): this {
        const gl = this._gl;
        if (gl) {
            gl.blendFunc(sfactor, dfactor);
        }
        return this;
    }

    /**
     * <p>
     * Sets the graphics buffers to values preselected by clearColor, clearDepth or clearStencil.
     * </p>
     */
    clear(mask = ClearBufferMask.COLOR_BUFFER_BIT | ClearBufferMask.DEPTH_BUFFER_BIT): this {
        const gl = this._gl;
        if (gl) {
            gl.clear(mask);
        }
        return this;
    }

    /**
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     */
    clearColor(red: number, green: number, blue: number, alpha: number): this {
        this._commands.pushWeakRef(new WebGLClearColor(this, red, green, blue, alpha));
        const gl = this._gl;
        if (gl) {
            gl.clearColor(red, green, blue, alpha);
        }
        return this;
    }

    /**
     * Specifies the clear value for the depth buffer.
     * This specifies what depth value to use when calling the clear() method.
     * The value is clamped between 0 and 1.
     *
     * @param depth Specifies the depth value used when the depth buffer is cleared.
     * The default value is 1.
     */
    clearDepth(depth: number): this {
        const gl = this._gl;
        if (gl) {
            gl.clearDepth(depth);
        }
        return this;
    }

    /**
     * @param s Specifies the index used when the stencil buffer is cleared.
     * The default value is 0.
     */
    clearStencil(s: number): this {
        const gl = this._gl;
        if (gl) {
            gl.clearStencil(s);
        }
        return this;
    }

    depthFunc(func: DepthFunction): this {
        const gl = this._gl;
        if (gl) {
            gl.depthFunc(func);
        }
        return this;
    }

    depthMask(flag: boolean): this {
        const gl = this._gl;
        if (gl) {
            gl.depthMask(flag);
        }
        return this;
    }

    /**
     * Disables the specified WebGL capability.
     */
    disable(capability: Capability): this {
        this._commands.pushWeakRef(new WebGLDisable(this, capability));
        if (this._gl) {
            this._gl.disable(capability);
        }
        return this;
    }

    /**
     * Enables the specified WebGL capability.
     */
    enable(capability: Capability): this {
        this._commands.pushWeakRef(new WebGLEnable(this, capability));
        if (this._gl) {
            this._gl.enable(capability);
        }
        return this;
    }

    /**
     * The underlying WebGL rendering context.
     */
    get gl(): WebGL2RenderingContext | WebGLRenderingContext {
        if (this._gl) {
            return this._gl;
        }
        else {
            return void 0;
        }
    }

    get contextId(): 'webgl2' | 'webgl' {
        return this._contextId;
    }

    /**
     * 
     */
    readPixels(x: number, y: number, width: number, height: number, format: PixelFormat, type: PixelType, pixels: ArrayBufferView): void {
        if (this._gl) {
            this._gl.readPixels(x, y, width, height, format, type, pixels);
        }
    }

    /**
     * @param user
     */
    removeContextListener(user: ContextConsumer): void {
        mustBeNonNullObject('user', user);
        const index = this._users.indexOf(user);
        if (index >= 0) {
            this._users.splice(index, 1);
        }
    }

    /**
     * A convenience method for setting the width and height properties of the
     * underlying canvas and for setting the viewport to the drawing buffer height and width.
     */
    size(width: number, height: number): this {
        this.canvas.width = mustBeNumber('width', width);
        this.canvas.height = mustBeNumber('height', height);
        return this.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    }

    /**
     * The viewport width and height are clamped to a range that is
     * implementation dependent.
     *
     * @returns e.g. Int32Array[16384, 16384]
     */
    getMaxViewportDims(): Int32Array {
        const gl = this._gl;
        if (gl) {
            return gl.getParameter(gl.MAX_VIEWPORT_DIMS);
        }
        else {
            return void 0;
        }
    }

    /**
     * Returns the current viewport settings.
     *
     * @returns e.g. Int32Array[x, y, width, height]
     */
    getViewport(): Int32Array {
        const gl = this._gl;
        if (gl) {
            return gl.getParameter(gl.VIEWPORT);
        }
        else {
            return void 0;
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
    viewport(x: number, y: number, width: number, height: number): this {
        const gl = this._gl;
        if (gl) {
            gl.viewport(x, y, width, height);
        }
        return this;
    }

    /**
     * Initializes the <code>WebGLRenderingContext</code> for the specified <code>HTMLCanvasElement</code>.
     *
     * @param canvas The HTML canvas element or canvas element identifier.
     * @param doc The document object model that contains the canvas identifier.
     */
    start(canvas: string | HTMLCanvasElement | WebGL2RenderingContext | WebGLRenderingContext, doc = window.document): this {
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
                console.warn(`${this.getLoggingName()} Ignoring start() because already started.`);
                return this;
            }
            else {
                // TODO: Really should strip
                const result = initWebGL(canvas, this._attributes, this._overrideContextId);
                this._gl = checkEnums(result.context);
                this._contextId = result.contextId;
                this.emitStartEvent();
                canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
            }
            return this;
        }
        else {
            if (isDefined(canvas)) {
                this._gl = checkEnums(canvas);
            }
            return this;
        }
    }

    /**
     *
     */
    stop(): this {
        if (isDefined(this._gl)) {
            this._gl.canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false);
            this._gl.canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false);
            if (this._gl) {
                this.emitStopEvent();
                this._gl = void 0;
            }
        }
        return this;
    }

    private emitStartEvent() {
        this._users.forEach((user: ContextConsumer) => {
            this.emitContextGain(user);
        });
        this._commands.forEach((command) => {
            this.emitContextGain(command);
        });
    }

    private emitContextGain(consumer: ContextConsumer): void {
        if (this._gl.isContextLost()) {
            consumer.contextLost();
        }
        else {
            consumer.contextGain();
        }
    }

    private emitStopEvent() {
        this._users.forEach((user: ContextConsumer) => {
            this.emitContextFree(user);
        });
        this._commands.forEach((command) => {
            this.emitContextFree(command);
        });
    }

    private emitContextFree(consumer: ContextConsumer): void {
        if (this._gl.isContextLost()) {
            consumer.contextLost();
        }
        else {
            consumer.contextFree();
        }
    }

    /**
     * @param consumer
     */
    synchronize(consumer: ContextConsumer): this {
        if (this._gl) {
            this.emitContextGain(consumer);
        }
        else {
            // FIXME: Broken symmetry?
        }
        return this;
    }

    /**
     * 
     */
    getCacheGeometry<G extends Geometry>(geometryKey: GeometryKey): G {
        mustBeNonNullObject('geometryKey', geometryKey);
        mustBeString('geometryKey.kind', geometryKey.kind);
        const key = JSON.stringify(geometryKey);
        const geometry = this.geometries[key];
        if (geometry && geometry.addRef) {
            geometry.addRef();
        }
        return <G>geometry;
    }

    /**
     * 
     */
    putCacheGeometry<G extends Geometry>(geometryKey: GeometryKey, geometry: G): void {
        mustBeNonNullObject('geometryKey', geometryKey);
        mustBeNonNullObject('geometry', geometry);
        mustBeString('geometryKey.kind', geometryKey.kind);
        const key = JSON.stringify(geometryKey);
        this.geometries[key] = geometry;
    }

    /**
     * 
     */
    getCacheMaterial<M extends Material>(materialKey: MaterialKey): M {
        mustBeNonNullObject('materialKey', materialKey);
        mustBeString('materialKey.kind', materialKey.kind);
        const key = JSON.stringify(materialKey);
        const material = this.materials[key];
        if (material && material.addRef) {
            material.addRef();
        }
        return <M>material;
    }

    /**
     * 
     */
    putCacheMaterial<M extends Material>(materialKey: MaterialKey, material: M): void {
        mustBeNonNullObject('materialKey', materialKey);
        mustBeNonNullObject('material', material);
        mustBeString('materialKey.kind', materialKey.kind);
        const key = JSON.stringify(materialKey);
        this.materials[key] = material;
    }

    /**
     * Computes the coordinates of a point in the image cube corresponding to device coordinates.
     * @param deviceX The x-coordinate of the device event.
     * @param deviceY The y-coordinate of the device event.
     * @param imageZ The optional value to use as the resulting depth coordinate.
     */
    deviceToImageCoords(deviceX: number, deviceY: number, imageZ = 0): Readonly<R3> {
        mustBeNumber('deviceX', deviceX);
        mustBeNumber('deviceY', deviceY);
        mustBeNumber('imageZ', imageZ);
        mustBeGE('imageZ', imageZ, -1);
        mustBeLE('imageZ', imageZ, +1);
        const imageX = ((2 * deviceX) / this.canvas.width) - 1;
        const imageY = 1 - (2 * deviceY) / this.canvas.height;
        return vectorFromCoords(imageX, imageY, imageZ);
    }
}
