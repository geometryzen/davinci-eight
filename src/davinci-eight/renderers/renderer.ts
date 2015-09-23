import Color = require('../core/Color')
import core = require('../core')
import EIGHTLogger = require('../commands/EIGHTLogger')
import expectArg = require('../checks/expectArg')
import ContextAttributesLogger = require('../commands/ContextAttributesLogger')
import ContextManager = require('../core/ContextManager')
import ContextRenderer = require('../renderers/ContextRenderer')
import IContextCommand = require('../core/IContextCommand')
import IDrawable = require('../core/IDrawable')
import IDrawList = require('../scene/IDrawList')
import IBufferGeometry = require('../dfx/IBufferGeometry')
import IMaterial = require('../core/IMaterial')
import IPrologCommand = require('../core/IPrologCommand')
import IUnknownArray = require('../utils/IUnknownArray')
import mustBeBoolean = require('../checks/mustBeBoolean')
import mustSatisfy = require('../checks/mustSatisfy')
import UniformData = require('../core/UniformData')
import refChange = require('../utils/refChange')
import uuid4 = require('../utils/uuid4')
import VersionLogger = require('../commands/VersionLogger')
import WebGLClear      = require('../commands/WebGLClear')
import WebGLClearColor = require('../commands/WebGLClearColor')
import WebGLEnable     = require('../commands/WebGLEnable')

function setStartUpCommands(renderer: ContextRenderer) {

  var cmd: IContextCommand

  // `EIGHT major.minor.patch (GitHub URL) YYYY-MM-DD`
  cmd = new EIGHTLogger()
  renderer.addContextGainCommand(cmd)
  cmd.release()

  // `WebGL major.minor (OpenGL ES ...)`
  // cmd = new VersionLogger()
  // renderer.addContextGainCommand(cmd)
  // cmd.release()

  // `alpha, antialias, depth, premultipliedAlpha, preserveDrawingBuffer, stencil`
  // cmd = new ContextAttributesLogger()
  // renderer.addContextGainCommand(cmd)
  // cmd.release()

  // cmd(red, green, blue, alpha)
  cmd = new WebGLClearColor(0.2, 0.2, 0.2, 1.0)
  renderer.addContextGainCommand(cmd)
  cmd.release()

  // enable(capability)
  cmd = new WebGLEnable(WebGLRenderingContext.DEPTH_TEST)
  renderer.addContextGainCommand(cmd)
  cmd.release()
}

function setPrologCommands(renderer: ContextRenderer) {

  var cmd: IPrologCommand

  // clear(mask)
  cmd = new WebGLClear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT)
  renderer.addPrologCommand(cmd)
  cmd.release()
}

let CLASS_NAME = "CanonicalContextRenderer"

/**
 * We need to know the canvasId so that we can tell drawables where to draw.
 * However, we don't need an don't want a canvas because we can only get that once the
 * canvas has loaded. I suppose a promise would be OK, but that's for another day.
 *
 * Part of the role of this class is to manage the commands that are executed at startup/prolog.
 */
let renderer = function(): ContextRenderer {
  var _manager: ContextManager;
  let uuid = uuid4().generate()
  let refCount = 1
  var _autoProlog: boolean = true;
  let prolog = new IUnknownArray<IPrologCommand>()
  let startUp = new IUnknownArray<IContextCommand>()

  let self: ContextRenderer = {
    addRef(): number {
      refCount++
      refChange(uuid, CLASS_NAME, +1)
      return refCount
    },
    get autoProlog(): boolean {
      return _autoProlog;
    },
    set autoProlog(autoProlog: boolean) {
      mustBeBoolean('autoProlog', autoProlog)
      _autoProlog = autoProlog;
    },
    get canvasElement(): HTMLCanvasElement {
      return _manager ? _manager.canvasElement : void 0
    },
    get gl(): WebGLRenderingContext {
      return _manager ? _manager.gl : void 0
    },
    contextFree() {
      _manager = void 0;
    },
    contextGain(manager: ContextManager) {
      // This object is single context, so we only ever get called with one manager at a time (serially).
      _manager = manager;
      startUp.forEach(function(command: IContextCommand){
        command.execute(manager.gl)
      })
    },
    contextLoss() {
      _manager = void 0;
    },
    prolog(): void {
      if (_manager) {
        for (var i = 0, length = prolog.length; i < length; i++) {
          prolog.getWeakReference(i).execute(_manager)
        }
      }
      else {
        if (core.verbose) {
          console.warn("Unable to execute prolog because WebGLRenderingContext is missing.")
        }
      }
    },
    addPrologCommand(command: IPrologCommand): void {
      prolog.push(command)
    },
    addContextGainCommand(command: IContextCommand): void {
      startUp.push(command)
    },
    release(): number {
      refCount--
      refChange(uuid, CLASS_NAME, -1)
      if (refCount === 0) {
        prolog.release()
        prolog = void 0
        startUp.release()
        startUp = void 0
        return 0
      }
      else {
        return refCount
      }
    }
  }
  refChange(uuid, CLASS_NAME, +1)
  setStartUpCommands(self)
  setPrologCommands(self)
  return self
}

export = renderer
