import ContextController = require('../core/ContextController');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import ContextListener = require('../core/ContextListener');
import ContextRenderer = require('../renderers/ContextRenderer');
import GeometryData = require('../dfx/GeometryData');
import IBuffer = require('../core/IBuffer');
import IContextCommand = require('../core/IContextCommand');
import IDrawList = require('../scene/IDrawList');
import IBufferGeometry = require('../dfx/IBufferGeometry');
import ITexture2D = require('../core/ITexture2D');
import Shareable = require('../utils/Shareable');
import UniformData = require('../core/UniformData');
/**
 * @class WebGLRenderer
 */
declare class WebGLRenderer extends Shareable implements ContextController, ContextMonitor, ContextRenderer {
    private _kahuna;
    private _renderer;
    /**
     * @class WebGLRenderer
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
    createTexture2D(): ITexture2D;
    gl: WebGLRenderingContext;
    prolog(): void;
    pushProlog(command: IContextCommand): void;
    pushStartUp(command: IContextCommand): void;
    removeContextListener(user: ContextListener): void;
    render(drawList: IDrawList, ambients: UniformData): void;
    setSize(width: number, height: number): void;
    start(canvas: HTMLCanvasElement, canvasId: number): void;
    stop(): void;
}
export = WebGLRenderer;
