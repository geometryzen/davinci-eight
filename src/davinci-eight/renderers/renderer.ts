import Color = require('../core/Color');
import EIGHTLogger = require('../commands/EIGHTLogger');
import expectArg = require('../checks/expectArg');
import ContextAttributesLogger = require('../commands/ContextAttributesLogger');
import ContextManager = require('../core/ContextManager');
import ContextRenderer = require('../renderers/ContextRenderer');
import IContextCommand = require('../core/IContextCommand');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IMesh = require('../dfx/IMesh');
import IProgram = require('../core/IProgram');
import IUnknownArray = require('../utils/IUnknownArray');
import mustSatisfy = require('../checks/mustSatisfy');
import UniformData = require('../core/UniformData');
import refChange = require('../utils/refChange');
import uuid4 = require('../utils/uuid4');
import VersionLogger = require('../commands/VersionLogger');
import WebGLClear      = require('../commands/WebGLClear');
import WebGLClearColor = require('../commands/WebGLClearColor');
import WebGLEnable     = require('../commands/WebGLEnable');

function setStartUpCommands(renderer: ContextRenderer) {

  var cmd: IContextCommand;

  // `EIGHT major.minor.patch (GitHub URL) YYYY-MM-DD`
  cmd = new EIGHTLogger();
  renderer.pushStartUp(cmd);
  cmd.release();

  // `WebGL major.minor (OpenGL ES ...)`
  cmd = new VersionLogger();
  renderer.pushStartUp(cmd);
  cmd.release();

  // `alpha, antialias, depth, premultipliedAlpha, preserveDrawingBuffer, stencil`
  cmd = new ContextAttributesLogger();
  renderer.pushStartUp(cmd);
  cmd.release();

  // cmd(red, green, blue, alpha)
  cmd = new WebGLClearColor(0.2, 0.2, 0.2, 1.0);
  renderer.pushStartUp(cmd);
  cmd.release();

  // enable(capability)
  cmd = new WebGLEnable(WebGLRenderingContext.DEPTH_TEST);
  renderer.pushStartUp(cmd);
  cmd.release();
}

function setPrologCommands(renderer: ContextRenderer) {

  var cmd: IContextCommand;

  // clear(mask)
  cmd = new WebGLClear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
  renderer.pushProlog(cmd);
  cmd.release();
}

let CLASS_NAME = "CanonicalContextRenderer"

/**
 *
 */
let renderer = function(canvas: HTMLCanvasElement, canvasId: number): ContextRenderer {
  // FIXME: Replace.
  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

  // Forced to cache this becuase of the need to avoid duplicating every call by wrapping.
  var gl: WebGLRenderingContext = void 0;
  let uuid = uuid4().generate();
  let refCount = 1;
  let prolog = new IUnknownArray<IContextCommand>();
  let startUp = new IUnknownArray<IContextCommand>();

  function drawHandler(drawable: IDrawable) {
    drawable.draw(canvasId);
  }

  let self: ContextRenderer = {
    addRef(): number {
      refCount++;
      refChange(uuid, CLASS_NAME, +1);
      return refCount;
    },
    get gl(): WebGLRenderingContext {
      return gl;
    },
    contextFree() {
      gl = void 0;
    },
    contextGain(manager: ContextManager) {
      gl = manager.gl;
      startUp.forEach(function(command: IContextCommand){
        command.execute(gl);
      });
    },
    contextLoss() {
      gl = void 0;
    },
    prolog(): void {
      if (gl) {
        prolog.forEach(function(command: IContextCommand){
          command.execute(gl);
        });
      }
      else {
        console.warn("Unable to execute prolog because WebGLRenderingContext is missing.");
      }
    },
    pushProlog(command: IContextCommand): void {
      prolog.push(command);
    },
    pushStartUp(command: IContextCommand): void {
      startUp.push(command);
    },
    release(): number {
      refCount--;
      refChange(uuid, CLASS_NAME, -1);
      if (refCount === 0) {
        prolog.release();
        prolog = void 0;
        startUp.release();
        startUp = void 0;
        return 0;
      }
      else {
        return refCount;
      }
    },
    render(drawList: IDrawList, unused: UniformData) {
      drawList.traverse(drawHandler);
    }
  };
  refChange(uuid, CLASS_NAME, +1);
  setStartUpCommands(self);
  setPrologCommands(self);
  return self;
};

export = renderer;
