import ContextController = require('../core/ContextController');
import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IContextConsumer = require('../core/IContextConsumer');
import IContextRenderer = require('../renderers/IContextRenderer');
import GeometryData = require('../geometries/GeometryData');
import IBuffer = require('../core/IBuffer');
import IContextCommand = require('../core/IContextCommand');
import IBufferGeometry = require('../geometries/IBufferGeometry');
import ITexture2D = require('../core/ITexture2D');
import ITextureCubeMap = require('../core/ITextureCubeMap');
import IUnknownArray = require('../collections/IUnknownArray');
import Shareable = require('../utils/Shareable');
/**
 * @class Canvas3D
 */
declare class Canvas3D extends Shareable implements ContextController, IContextProvider, IContextMonitor, IContextRenderer {
    private _kahuna;
    private _renderer;
    /**
     * @class Canvas3D
     * @constructor
     * @param canvasBuilder {() => HTMLCanvasElement} The canvas is created lazily, allowing construction during DOM load.
     * @param canvasId [number=0] A user-supplied integer canvas identifier. User is responsible for keeping them unique.
     * @param attributes [WebGLContextAttributes] Allow the context to be configured.
     * @beta
     */
    constructor(attributes?: WebGLContextAttributes);
    /**
     * @method destructor
     * return {void}
     * @protected
     */
    protected destructor(): void;
    addContextListener(user: IContextConsumer): void;
    canvas: HTMLCanvasElement;
    /**
     * @property canvasId
     * @type {number}
     * @readOnly
     */
    canvasId: number;
    commands: IUnknownArray<IContextCommand>;
    contextFree(canvasId: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId: number): void;
    createArrayBuffer(): IBuffer;
    createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry;
    createElementArrayBuffer(): IBuffer;
    createTextureCubeMap(): ITextureCubeMap;
    createTexture2D(): ITexture2D;
    gl: WebGLRenderingContext;
    removeContextListener(user: IContextConsumer): void;
    setSize(width: number, height: number): void;
    start(canvas: HTMLCanvasElement, canvasId: number): void;
    stop(): void;
    synchronize(user: IContextConsumer): void;
}
export = Canvas3D;
