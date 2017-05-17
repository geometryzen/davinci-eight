import { BlendingFactorDest } from './BlendingFactorDest';
import { BlendingFactorSrc } from './BlendingFactorSrc';
import { Capability } from './Capability';
import { DepthFunction } from './DepthFunction';
import { ContextConsumer } from './ContextConsumer';
import { ContextManager } from './ContextManager';
import { Geometry } from './Geometry';
import { GeometryKey } from './GeometryKey';
import { Material } from './Material';
import { MaterialKey } from './MaterialKey';
import { PixelFormat } from './PixelFormat';
import { PixelType } from './PixelType';
import { R3 } from '../math/R3';
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
 *
 *     export const e1 = EIGHT.Geometric3.e1;
 *     export const e2 = EIGHT.Geometric3.e2;
 *     export const e3 = EIGHT.Geometric3.e3;
 *
 *     const engine = new EIGHT.Engine('canvas3D')
 *       .size(500, 500)
 *       .clearColor(0.1, 0.1, 0.1, 1.0)
 *       .enable(EIGHT.Capability.DEPTH_TEST)
 *
 *     const scene = new EIGHT.Scene(engine)
 *
 *     const ambients: EIGHT.Facet[] = []
 *
 *     const camera = new EIGHT.PerspectiveCamera()
 *     camera.eye = e2 + 3 * e3
 *     ambients.push(camera)
 *
 *     const dirLight = new EIGHT.DirectionalLight()
 *     ambients.push(dirLight)
 *
 *     const trackball = new EIGHT.TrackballControls(camera)
 *     trackball.subscribe(engine.canvas)
 *
 *     const box = new EIGHT.Box(engine)
 *     box.color = EIGHT.Color.green
 *     scene.add(box)
 *
 *     const animate = function(timestamp: number) {
 *       engine.clear()
 *
 *       trackball.update()
 *
 *       dirLight.direction = camera.look - camera.eye
 *
 *       box.attitude.rotorFromAxisAngle(e2, timestamp * 0.001)
 *
 *       scene.render(ambients)
 *
 *       requestAnimationFrame(animate)
 *     }
 *
 *     requestAnimationFrame(animate)
 */
export declare class Engine extends ShareableBase implements ContextManager {
    /**
     *
     */
    private _gl;
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
     * Actions that are executed when a WebGLRenderingContext is gained.
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
    constructor(canvas?: string | HTMLCanvasElement | WebGLRenderingContext, attributes?: EngineAttributes, doc?: Document);
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
    readonly canvas: HTMLCanvasElement;
    readonly drawingBufferHeight: number;
    readonly drawingBufferWidth: number;
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
    readonly gl: WebGLRenderingContext;
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
    start(canvas: string | HTMLCanvasElement | WebGLRenderingContext, doc?: Document): this;
    /**
     *
     */
    stop(): this;
    private emitStartEvent();
    private emitContextGain(consumer);
    private emitStopEvent();
    private emitContextFree(consumer);
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
