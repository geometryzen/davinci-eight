import ContextController = require('../core/ContextController');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import ContextListener = require('../core/ContextListener');
import ContextRenderer = require('../renderers/ContextRenderer');
import GeometryData = require('../dfx/GeometryData');
import IBuffer = require('../core/IBuffer');
import IContextCommand = require('../core/IContextCommand');
import IBufferGeometry = require('../dfx/IBufferGeometry');
import ITexture2D = require('../core/ITexture2D');
import ITextureCubeMap = require('../core/ITextureCubeMap');
import IPrologCommand = require('../core/IPrologCommand');
import Shareable = require('../utils/Shareable');
/**
 * @class Canvas3D
 */
declare class Canvas3D extends Shareable implements ContextController, ContextManager, ContextMonitor, ContextRenderer {
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
    addContextListener(user: ContextListener): void;
    /**
     * <p>
     * Determines whether prolog commands are run automatically as part of the `render()` call.
     * </p>
     * @property autoProlog
     * @type boolean
     * @default true
     */
    autoProlog: boolean;
    canvasElement: HTMLCanvasElement;
    /**
     * @property canvasId
     * @type {number}
     * @readOnly
     */
    canvasId: number;
    contextFree(canvasId: number): void;
    contextGain(manager: ContextManager): void;
    contextLoss(canvasId: number): void;
    createArrayBuffer(): IBuffer;
    createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry;
    createElementArrayBuffer(): IBuffer;
    createTextureCubeMap(): ITextureCubeMap;
    createTexture2D(): ITexture2D;
    gl: WebGLRenderingContext;
    prolog(): void;
    addPrologCommand(command: IPrologCommand): void;
    addContextGainCommand(command: IContextCommand): void;
    removeContextListener(user: ContextListener): void;
    setSize(width: number, height: number): void;
    start(canvas: HTMLCanvasElement, canvasId: number): void;
    stop(): void;
}
export = Canvas3D;