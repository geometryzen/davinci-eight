import core = require('davinci-eight/core');
import Drawable = require('../core/Drawable');
import Renderer = require('../renderers/Renderer');
import RendererParameters = require('../renderers/RendererParameters');
import ShaderProgram = require('../core/ShaderProgram');
import DrawList = require('../drawLists/DrawList');
import UniformProvider = require('../core/UniformProvider');
import expectArg = require('../checks/expectArg');
import Color = require('../core/Color');

let renderer = function(canvas: HTMLCanvasElement, parameters?: RendererParameters): Renderer {

    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

    parameters = parameters || {};

    var $context: WebGLRenderingContext = void 0;
    var refCount: number = 0;
    var autoClear: boolean = true;
    let clearColor: Color = Color.fromRGB(0, 0, 0);
    var clearAlpha: number = 0;

    function drawHandler(drawable: Drawable) {
      drawable.draw();
    }

    let self: Renderer = {
      get canvas() { return canvas; },
      get context(): WebGLRenderingContext { return $context;},
      addRef() {
        refCount++;
        // console.log("renderer.addRef() => " + refCount);
      },
      release() {
        refCount--;
        // console.log("renderer.release() => " + refCount);
        if (refCount === 0) {
          $context = void 0;
        }
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
        context.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearAlpha);
        context.clearDepth(1.0); 
        context.enable($context.DEPTH_TEST);
        context.depthFunc($context.LEQUAL);
        context.viewport(0, 0, canvas.width, canvas.height);
      },
      contextLoss() {
        $context = void 0;
      },
      hasContext() {
        return !!$context;
      },
      get autoClear(): boolean {
        return autoClear;
      },
      set autoClear(value: boolean) {
        autoClear = expectArg('autoClear', value).toBeBoolean().value;
      },
      clearColor(red: number, green: number, blue: number, alpha: number): Renderer {
        clearColor.red = expectArg('red', red).toBeNumber().value;
        clearColor.green = expectArg('green', green).toBeNumber().value;
        clearColor.blue = expectArg('blue', blue).toBeNumber().value;
        clearAlpha = expectArg('alpha', alpha).toBeNumber().value;
        if ($context) {
          $context.clearColor(red, green, blue, alpha);
        }
        return self;
      },
      render(scene: DrawList) {
        var program;
        if ($context) {
          if (autoClear) {
            $context.clear($context.COLOR_BUFFER_BIT | $context.DEPTH_BUFFER_BIT);
          }
          scene.traverse(drawHandler);
        }
        else {
          console.warn("renderer is unable to render because WebGLRenderingContext is missing");
        }
      },
    };

    return self;
};

export = renderer;
