import AttribProvider = require('../core/AttribProvider');
import Color = require('../core/Color');
import Drawable = require('../core/Drawable');
import DrawableVisitor = require('../core/DrawableVisitor');
import DrawList = require('../drawLists/DrawList');
import expectArg = require('../checks/expectArg');
import Renderer = require('../renderers/Renderer');
import RendererParameters = require('../renderers/RendererParameters');
import ShaderProgram = require('../core/ShaderProgram');
import UniformData = require('../core/UniformData');

class DefaultDrawableVisitor implements DrawableVisitor {
  constructor() {
  }
  primitive(mesh: AttribProvider, program: ShaderProgram, model: UniformData) {
    if (mesh.dynamic) {
      mesh.update();
    }

    program.use();

    model.accept(program);
    program.setAttributes(mesh.getAttribData());

    let attributes = program.attributes;
    for (var name in attributes) {
      attributes[name].enable();
    }
    mesh.draw();
    for (var name in attributes) {
      attributes[name].disable();
    }
  }
}

// This visitor is completely stateless so we can create it here.
let drawVisitor: DrawableVisitor = new DefaultDrawableVisitor();

let renderer = function(canvas: HTMLCanvasElement, parameters?: RendererParameters): Renderer {

  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

  parameters = parameters || {};

  var $context: WebGLRenderingContext = void 0;
  var refCount: number = 1;
  var autoClear: boolean = true;
  let clearColor: Color = Color.fromRGB(0, 0, 0);
  var clearAlpha: number = 0;

  function drawHandler(drawable: Drawable) {
    drawable.accept(drawVisitor);
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
    contextGain(context: WebGLRenderingContext) {
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
    render(drawList: DrawList) {
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
