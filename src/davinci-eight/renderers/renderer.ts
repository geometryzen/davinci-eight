import core = require('../core');
import Color = require('../core/Color');
import expectArg = require('../checks/expectArg');
import ContextManager = require('../core/ContextManager');
import ContextRenderer = require('../renderers/ContextRenderer');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IMesh = require('../dfx/IMesh');
import IProgram = require('../core/IProgram');
import UniformData = require('../core/UniformData');
import uuid4 = require('../utils/uuid4');

let CLASS_NAME = "ContextRenderer"

// FIXME: multi-context monitors: etc
// FIXME; Remove attributes
/**
 *
 */
let renderer = function(canvas: HTMLCanvasElement): ContextRenderer {
  // FIXME: Replace.
  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

  // Forced to cache this becuase of the need to avoid duplicating every call by wrapping.
  var gl: WebGLRenderingContext = void 0;
  var autoClear: boolean = true;
  let clearColor: Color = Color.fromRGB(0, 0, 0);
  var clearAlpha: number = 0;
  let uuid = uuid4().generate();

  function drawHandler(drawable: IDrawable) {
    drawable.draw();
  }

  let self: ContextRenderer = {
    get canvas() { return canvas; },
    get gl(): WebGLRenderingContext { return gl;},
    contextFree() {
      gl = void 0;
    },
    contextGain(manager: ContextManager) {
      // FIXME: multi-context
      gl = manager.gl;
      console.log(core.NAMESPACE + " " + core.VERSION + " (" + core.GITHUB + ") " + core.LAST_AUTHORED_DATE);
      if (core.LOG_WEBGL_VERSION) {
        console.log(gl.getParameter(gl.VERSION));
      }
      if (core.LOG_WEBGL_CONTEXT_ATTRIBUTES) {
        let attributes: WebGLContextAttributes = gl.getContextAttributes();
        console.log("alpha                 => " + attributes.alpha);
        console.log("antialias             => " + attributes.antialias);
        console.log("depth                 => " + attributes.depth);
        console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
        console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
        console.log("stencil               => " + attributes.stencil);
      }
      gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha);
      gl.clearDepth(1.0); 
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    contextLoss() {
      gl = void 0;
    },
    get autoClear(): boolean {
      return autoClear;
    },
    set autoClear(value: boolean) {
      autoClear = expectArg('autoClear', value).toBeBoolean().value;
    },
    clearColor(red: number, green: number, blue: number, alpha: number): void {
      clearColor.r = expectArg('red',   red  ).toBeNumber().value;
      clearColor.g = expectArg('green', green).toBeNumber().value;
      clearColor.b = expectArg('blue',  blue ).toBeNumber().value;
      clearAlpha   = expectArg('alpha', alpha).toBeNumber().value;
      if (gl) {
        gl.clearColor(red, green, blue, alpha);
      }
    },
    render(drawList: IDrawList) {
      if (gl) {
        if (autoClear) {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
      }
      else {
        console.warn("renderer is unable to clear because WebGLRenderingContext is missing");
      }
      drawList.traverse(drawHandler);
    }
  };
  return self;
};

export = renderer;
