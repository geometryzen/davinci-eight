import createRenderer = require('../renderers/renderer')
import ContextController = require('../core/ContextController')
import ContextKahuna = require('../core/ContextKahuna')
import IContextProvider = require('../core/IContextProvider')
import IContextMonitor = require('../core/IContextMonitor')
import IContextConsumer = require('../core/IContextConsumer')
import contextProxy = require('../utils/contextProxy')
import ContextRenderer = require('../renderers/ContextRenderer')
import core = require('../core')
import GeometryData = require('../geometries/GeometryData')
import IBuffer = require('../core/IBuffer')
import IContextCommand = require('../core/IContextCommand')
import IDrawList = require('../scene/IDrawList')
import IBufferGeometry = require('../geometries/IBufferGeometry')
import ITexture2D = require('../core/ITexture2D')
import ITextureCubeMap = require('../core/ITextureCubeMap')
import IPrologCommand = require('../core/IPrologCommand')
import IUnknown = require('../core/IUnknown')
import mustBeDefined = require('../checks/mustBeDefined')
import mustBeFunction = require('../checks/mustBeFunction')
import mustBeInteger = require('../checks/mustBeInteger')
import mustSatisfy = require('../checks/mustSatisfy')
import readOnly = require('../i18n/readOnly')
import Scene = require('../scene/Scene')
import Shareable = require('../utils/Shareable')
import IFacet = require('../core/IFacet')

function beHTMLCanvasElement(): string {
  return "be an HTMLCanvasElement"
}

let defaultCanvasBuilder = () => {return document.createElement('canvas')}

/**
 * @class Canvas3D
 */
class Canvas3D extends Shareable implements ContextController, IContextProvider, IContextMonitor, ContextRenderer {
  private _kahuna: ContextKahuna;
  private _renderer: ContextRenderer;
  /**
   * @class Canvas3D
   * @constructor
   * @param canvasBuilder {() => HTMLCanvasElement} The canvas is created lazily, allowing construction during DOM load.
   * @param canvasId [number=0] A user-supplied integer canvas identifier. User is responsible for keeping them unique.
   * @param attributes [WebGLContextAttributes] Allow the context to be configured.
   * @beta
   */
  // FIXME: Move attributes to start()
  constructor(attributes?: WebGLContextAttributes) {
    super('Canvas3D')
    this._kahuna = contextProxy(attributes)
    this._renderer = createRenderer()
    this._kahuna.addContextListener(this._renderer)
    this._kahuna.synchronize(this._renderer)
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
  addContextListener(user: IContextConsumer): void {
    this._kahuna.addContextListener(user)
  }
  /**
   * <p>
   * Determines whether prolog commands are run automatically as part of the `render()` call.
   * </p>
   * @property autoProlog
   * @type boolean
   * @default true
   */
  get autoProlog(): boolean {
    return this._renderer.autoProlog;
  }
  set autoProlog(autoProlog) {
    this._renderer.autoProlog = autoProlog;
  }
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
  /* FIXME: Do we need this. Why. Why not kahuna too?
  // No contract says that we need to return this.
  // It's cust that convenience of having someone else do it for you!
  get canvas(): HTMLCanvasElement {
    return this._kahuna
    return this._canvas
  }
  */
  contextFree(canvasId: number) {
    this._renderer.contextFree(canvasId)
  }
  contextGain(manager: IContextProvider) {
    this._renderer.contextGain(manager)
  }
  contextLost(canvasId: number) {
    this._renderer.contextLost(canvasId)
  }
  createArrayBuffer(): IBuffer {
    return this._kahuna.createArrayBuffer()
  }
  createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry {
    return this._kahuna.createBufferGeometry(elements, mode, usage)
  }
  createElementArrayBuffer(): IBuffer {
    return this._kahuna.createElementArrayBuffer()
  }
  createTextureCubeMap(): ITextureCubeMap {
    return this._kahuna.createTextureCubeMap()
  }
  createTexture2D(): ITexture2D {
    return this._kahuna.createTexture2D()
  }
  get gl(): WebGLRenderingContext {
    return this._kahuna.gl
  }
  prolog(): void {
    this._renderer.prolog()
  }
  addPrologCommand(command: IPrologCommand): IPrologCommand {
    return this._renderer.addPrologCommand(command)
  }
  addContextGainCommand(command: IContextCommand): IContextCommand {
    return this._renderer.addContextGainCommand(command)
  }
  removeContextListener(user: IContextConsumer): void {
    this._kahuna.removeContextListener(user)
  }
  setSize(width: number, height: number): void {
    mustBeInteger('width', width)
    mustBeInteger('height', height)
    let canvas = this.canvas
    canvas.width = width
    canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }
  start(canvas: HTMLCanvasElement, canvasId: number): void {
    // FIXME: DRY delegate to kahuna.
    if (!(canvas instanceof HTMLElement)) {
      if (core.verbose) {
        console.warn("canvas must be an HTMLCanvasElement to start the context.")
      }
      return
    }
    mustBeDefined('canvas', canvas)
    mustBeInteger('canvasId', canvasId)
    this._kahuna.start(canvas, canvasId)
  }
  stop(): void {
    this._kahuna.stop()
  }
  synchronize(user: IContextConsumer) {
    this._kahuna.synchronize(user)
  }
}

export = Canvas3D