import Color = require('../core/Color');
import expectArg = require('../checks/expectArg');
import ContextManager = require('../core/ContextManager');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IMesh = require('../dfx/IMesh');
import IProgram = require('../core/IProgram');
import Renderer = require('../renderers/Renderer');
import UniformData = require('../core/UniformData');
// FIXME: refChange for the renderer.

// FIXME: multi-context monitors: etc
// FIXME; Remove attributes
let renderer = function(canvas: HTMLCanvasElement): Renderer {
  // FIXME: Replace.
  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

  var $context: WebGLRenderingContext = void 0;
  var refCount: number = 1;
  var autoClear: boolean = true;
  let clearColor: Color = Color.fromRGB(0, 0, 0);
  var clearAlpha: number = 0;

  function drawHandler(drawable: IDrawable) {
    drawable.draw();
  }

  let self: Renderer = {
    get canvas() { return canvas; },
    get context(): WebGLRenderingContext { return $context;},
    addRef(): number {
      refCount++;
      // console.log("renderer.addRef() => " + refCount);
      return refCount;
    },
    release(): number {
      refCount--;
      // console.log("renderer.release() => " + refCount);
      if (refCount === 0) {
        $context = void 0;
      }
      return refCount;
    },
    contextFree() {
      $context = void 0;
    },
    contextGain(manager: ContextManager) {
      // FIXME: multi-context
      let context = manager.context;
      //let attributes: WebGLContextAttributes = context.getContextAttributes();
      //console.log(context.getParameter(context.VERSION));
      //console.log("alpha                 => " + attributes.alpha);
      //console.log("antialias             => " + attributes.antialias);
      //console.log("depth                 => " + attributes.depth);
      //console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
      //console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
      //console.log("stencil               => " + attributes.stencil);
      $context = context;
      context.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha);
      context.clearDepth(1.0); 
      context.enable($context.DEPTH_TEST);
      context.depthFunc($context.LEQUAL);
      context.viewport(0, 0, canvas.width, canvas.height);
    },
    contextLoss() {
      $context = void 0;
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
      if ($context) {
        $context.clearColor(red, green, blue, alpha);
      }
    },
    render(drawList: IDrawList) {
      if ($context) {
        if (autoClear) {
          $context.clear($context.COLOR_BUFFER_BIT | $context.DEPTH_BUFFER_BIT);
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
