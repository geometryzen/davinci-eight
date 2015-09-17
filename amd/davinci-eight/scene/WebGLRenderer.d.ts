import ContextController = require('../core/ContextController');
import ContextMonitor = require('../core/ContextMonitor');
import ContextListener = require('../core/ContextListener');
import DrawElements = require('../dfx/DrawElements');
import IMesh = require('../dfx/IMesh');
import Scene = require('../scene/Scene');
import UniformData = require('../core/UniformData');
declare class WebGLRenderer implements ContextController, ContextMonitor {
    private _canvas;
    private _kahuna;
    private _renderer;
    private _canvasId;
    constructor(canvas?: HTMLCanvasElement, canvasId?: number, attributes?: WebGLContextAttributes);
    addContextListener(user: ContextListener): void;
    canvasId: number;
    context: WebGLRenderingContext;
    createDrawElementsMesh(elements: DrawElements, mode?: number, usage?: number): IMesh;
    domElement: HTMLCanvasElement;
    removeContextListener(user: ContextListener): void;
    render(scene: Scene, ambients: UniformData): void;
    setClearColor(color: number, alpha?: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    start(): void;
    stop(): void;
}
export = WebGLRenderer;
