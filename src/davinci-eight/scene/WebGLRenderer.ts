import createRenderer = require('../renderers/renderer');
import ContextController = require('../core/ContextController');
import ContextKahuna = require('../core/ContextKahuna');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import ContextListener = require('../core/ContextListener');
import contextProxy = require('../utils/contextProxy');
import ContextRenderer = require('../renderers/ContextRenderer');
import DrawElements = require('../dfx/DrawElements');
import IContextCommand = require('../core/IContextCommand');
import IDrawList = require('../scene/IDrawList');
import IMesh = require('../dfx/IMesh');
import IUnknown = require('../core/IUnknown');
import mustBeInteger = require('../checks/mustBeInteger');
import mustSatisfy = require('../checks/mustSatisfy');
import Scene = require('../scene/Scene');
import Shareable = require('../utils/Shareable');
import UniformData = require('../core/UniformData');

function beHTMLCanvasElement(): string {
  return "be an HTMLCanvasElement";
}

class WebGLRenderer extends Shareable implements ContextController, ContextMonitor, ContextRenderer {
  private _canvas: HTMLCanvasElement;
  private _canvasId: number;
  private _kahuna: ContextKahuna;
  private _renderer: ContextRenderer;
  constructor(canvas?: HTMLCanvasElement, canvasId: number = 0, attributes?: WebGLContextAttributes) {
    super('WebGLRenderer');
    if (canvas) {
      mustSatisfy('canvas', canvas instanceof HTMLCanvasElement, beHTMLCanvasElement);
      this._canvas = canvas;
    }
    else {
      this._canvas = document.createElement('canvas');
    }
    this._canvasId = mustBeInteger('canvasId', canvasId);
    this._kahuna = contextProxy(this._canvas, canvasId, attributes);
    this._renderer = createRenderer(this._canvas, canvasId);
    this._kahuna.addContextListener(this._renderer);
  }
  destructor(): void {
    this._kahuna.removeContextListener(this._renderer);
    this._kahuna.release();
    this._kahuna = void 0;
    this._renderer.release();
    this._renderer = void 0;
    this._canvasId = void 0;
    this._canvas = void 0;
  }
  addContextListener(user: ContextListener): void {
    this._kahuna.addContextListener(user);
  }
  get canvasId(): number {
    return this._canvasId;
  }
  createDrawElementsMesh(elements: DrawElements, mode?: number, usage?: number): IMesh {
    return this._kahuna.createDrawElementsMesh(elements, mode, usage);
  }
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  contextFree(canvasId: number) {
    this._renderer.contextFree(canvasId);
  }
  contextGain(manager: ContextManager) {
    this._renderer.contextGain(manager);
  }
  contextLoss(canvasId: number) {
    this._renderer.contextLoss(canvasId);
  }
  get gl(): WebGLRenderingContext {
    return this._kahuna.gl;
  }
  prolog(): void {
    this._renderer.prolog();
  }
  pushProlog(command: IContextCommand): void {
    this._renderer.pushProlog(command);
  }
  pushStartUp(command: IContextCommand): void {
    this._renderer.pushStartUp(command);
  }
  removeContextListener(user: ContextListener): void {
    this._kahuna.removeContextListener(user);
  }
  render(drawList: IDrawList, ambients: UniformData): void {
    // FIXME: The camera will provide uniforms, but I need to get them into the renderer loop.
    // This implies camera should implement UniformData and we pass that in as ambients.
    // This allows us to generalize the WebGLRenderer API.
    this._renderer.render(drawList, ambients);
  }
  start(): void {
    this._kahuna.start();
  }
  stop(): void {
    this._kahuna.stop();
  }
}

export = WebGLRenderer;