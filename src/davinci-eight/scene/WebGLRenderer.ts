import ContextController = require('../core/ContextController');
import ContextKahuna = require('../core/ContextKahuna');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import ContextListener = require('../core/ContextListener');
import contextProxy = require('../utils/contextProxy');
import createRenderer = require('../renderers/renderer');
import DrawElements = require('../dfx/DrawElements');
import IMesh = require('../dfx/IMesh');
import IUnknown = require('../core/IUnknown');
import mustBeInteger = require('../checks/mustBeInteger');
import mustSatisfy = require('../checks/mustSatisfy');
import refChange = require('../utils/refChange');
import ContextRenderer = require('../renderers/ContextRenderer');
import Scene = require('../scene/Scene');
import UniformData = require('../core/UniformData');
import uuid4 = require('../utils/uuid4');

let LOGGING_NAME = 'WebGLRenderer';
// FIXME: ContextManger may be reference counted so this class may need to be too.

function ctorContext(): string {
  return LOGGING_NAME + " constructor";
}

function beHTMLCanvasElement(): string {
  return "be an HTMLCanvasElement";
}

class WebGLRenderer implements ContextController, ContextMonitor, IUnknown {
  private _canvas: HTMLCanvasElement;
  private _kahuna: ContextKahuna;
  private _renderer: ContextRenderer;
  private _canvasId: number;
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  constructor(canvas?: HTMLCanvasElement, canvasId: number = 0, attributes?: WebGLContextAttributes) {
    if (canvas) {
      mustSatisfy('canvas', canvas instanceof HTMLCanvasElement, beHTMLCanvasElement, ctorContext);
      this._canvas = canvas;
    }
    else {
      this._canvas = document.createElement('canvas');
    }
    this._canvasId = mustBeInteger('canvasId', canvasId, ctorContext);
    // FIXME: dangerous chaining?
    // FIXME: The proxy is reference counted so WebGLRenderer should be too.
    this._kahuna = contextProxy(this._canvas, canvasId, attributes);
    this._renderer = createRenderer(this._canvas);
    // Provide the manager with access to the WebGLRenderingContext.
    this._kahuna.addContextListener(this._renderer);
    refChange(this._uuid, LOGGING_NAME, +1);
  }
  addContextListener(user: ContextListener): void {
    this._kahuna.addContextListener(user);
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, LOGGING_NAME, +1);
    return this._refCount;
  }
  get canvasId(): number {
    return this._canvasId;
  }
  // FIXME: Rename this property to gl, which is the normal usage.
  get gl(): WebGLRenderingContext {
    return this._kahuna.gl;
  }
  createDrawElementsMesh(elements: DrawElements, mode?: number, usage?: number): IMesh {
    return this._kahuna.createDrawElementsMesh(elements, mode, usage);
  }
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, LOGGING_NAME, -1);
    if (this._refCount === 0) {
      this._kahuna.release();
      this._canvas = void 0;
      this._canvasId = void 0;
      this._kahuna = void 0;
      this._refCount = void 0;
      this._renderer = void 0;
      return 0;
    }
    else {
      return this._refCount;
    }
  }
  removeContextListener(user: ContextListener): void {
    this._kahuna.removeContextListener(user);
  }
  render(scene: Scene, ambients: UniformData): void {
    // FIXME: The camera will provide uniforms, but I need to get them into the renderer loop.
    // This implies camera should implement UniformData and we pass that in as ambients.
    // This allows us to generalize the WebGLRenderer API.
    this._renderer.render(scene, ambients);
  }
  setClearColor(color: number, alpha: number = 1.0): void {
    console.warn("WegGLRenderer.setClearColor(). Making it up as we go along.");
    this._renderer.clearColor(0.2, 0.2, 0.2, alpha)
  }
  setSize(width: number, height: number, updateStyle?: boolean): void {
    console.warn("WegGLRenderer.setSize()");
  }
  start(): void {
    this._kahuna.start();
  }
  stop(): void {
    this._kahuna.stop();
  }
}

export = WebGLRenderer;