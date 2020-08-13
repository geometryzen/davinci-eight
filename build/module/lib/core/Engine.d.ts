import { R3 } from '../math/R3';
import { BlendingFactorDest } from './BlendingFactorDest';
import { BlendingFactorSrc } from './BlendingFactorSrc';
import { Capability } from './Capability';
import { ContextConsumer } from './ContextConsumer';
import { ContextManager } from './ContextManager';
import { DepthFunction } from './DepthFunction';
import { Geometry } from './Geometry';
import { GeometryKey } from './GeometryKey';
import { Material } from './Material';
import { MaterialKey } from './MaterialKey';
import { PixelFormat } from './PixelFormat';
import { PixelType } from './PixelType';
import { ShareableBase } from './ShareableBase';
export interface EngineAttributes extends WebGLContextAttributes {
    eightLogging?: boolean;
    webglLogging?: boolean;
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
export declare class Engine extends ShareableBase implements ContextManager {
    /**
     *
     */
    private _gl;
    private _contextId;
    /**
     *
     */
    private _attributes;
    private _users;
    /**
     *
     */
    private _webGLContextLost;
    /**
     *
     */
    private _webGLContextRestored;
    /**
     * Actions that are executed when a WebGL rendering context is gained.
     */
    private _commands;
    /**
     * The cache of Geometry.
     */
    private geometries;
    /**
     * The cache of Material.
     */
    private materials;
    /**
     * @param canvas
     * @param attributes Allows the context to be configured.
     * @param doc The document object model that contains the canvas identifier.
     */
    constructor(canvas?: string | HTMLCanvasElement | WebGL2RenderingContext, attributes?: EngineAttributes, doc?: Document);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     *
     */
    addContextListener(user: ContextConsumer): void;
    /**
     * The canvas element associated with the WebGLRenderingContext.
     */
    get canvas(): HTMLCanvasElement;
    get drawingBufferHeight(): number;
    get drawingBufferWidth(): number;
    blendFunc(sfactor: BlendingFactorSrc, dfactor: BlendingFactorDest): this;
    /**
     * <p>
     * Sets the graphics buffers to values preselected by clearColor, clearDepth or clearStencil.
     * </p>
     */
    clear(mask?: number): this;
    /**
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     */
    clearColor(red: number, green: number, blue: number, alpha: number): this;
    /**
     * Specifies the clear value for the depth buffer.
     * This specifies what depth value to use when calling the clear() method.
     * The value is clamped between 0 and 1.
     *
     * @param depth Specifies the depth value used when the depth buffer is cleared.
     * The default value is 1.
     */
    clearDepth(depth: number): this;
    /**
     * @param s Specifies the index used when the stencil buffer is cleared.
     * The default value is 0.
     */
    clearStencil(s: number): this;
    depthFunc(func: DepthFunction): this;
    depthMask(flag: boolean): this;
    /**
     * Disables the specified WebGL capability.
     */
    disable(capability: Capability): this;
    /**
     * Enables the specified WebGL capability.
     */
    enable(capability: Capability): this;
    /**
     * The underlying WebGL rendering context.
     */
    get gl(): WebGL2RenderingContext | WebGLRenderingContext;
    get contextId(): 'webgl2' | 'webgl';
    /**
     *
     */
    readPixels(x: number, y: number, width: number, height: number, format: PixelFormat, type: PixelType, pixels: ArrayBufferView): void;
    /**
     * @param user
     */
    removeContextListener(user: ContextConsumer): void;
    /**
     * A convenience method for setting the width and height properties of the
     * underlying canvas and for setting the viewport to the drawing buffer height and width.
     */
    size(width: number, height: number): this;
    /**
     * The viewport width and height are clamped to a range that is
     * implementation dependent.
     *
     * @returns e.g. Int32Array[16384, 16384]
     */
    getMaxViewportDims(): Int32Array;
    /**
     * Returns the current viewport settings.
     *
     * @returns e.g. Int32Array[x, y, width, height]
     */
    getViewport(): Int32Array;
    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     *
     * @param x
     * @param y
     * @param width
     * @param height
     */
    viewport(x: number, y: number, width: number, height: number): this;
    /**
     * Initializes the <code>WebGLRenderingContext</code> for the specified <code>HTMLCanvasElement</code>.
     *
     * @param canvas The HTML canvas element or canvas element identifier.
     * @param doc The document object model that contains the canvas identifier.
     */
    start(canvas: string | HTMLCanvasElement | WebGL2RenderingContext | WebGLRenderingContext, doc?: Document): this;
    /**
     *
     */
    stop(): this;
    private emitStartEvent;
    private emitContextGain;
    private emitStopEvent;
    private emitContextFree;
    /**
     * @param consumer
     */
    synchronize(consumer: ContextConsumer): this;
    /**
     *
     */
    getCacheGeometry<G extends Geometry>(geometryKey: GeometryKey): G;
    /**
     *
     */
    putCacheGeometry<G extends Geometry>(geometryKey: GeometryKey, geometry: G): void;
    /**
     *
     */
    getCacheMaterial<M extends Material>(materialKey: MaterialKey): M;
    /**
     *
     */
    putCacheMaterial<M extends Material>(materialKey: MaterialKey, material: M): void;
    /**
     * Computes the coordinates of a point in the image cube corresponding to device coordinates.
     * @param deviceX The x-coordinate of the device event.
     * @param deviceY The y-coordinate of the device event.
     * @param imageZ The optional value to use as the resulting depth coordinate.
     */
    deviceToImageCoords(deviceX: number, deviceY: number, imageZ?: number): Readonly<R3>;
}
