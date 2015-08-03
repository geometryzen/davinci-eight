import renderer = require('../renderers/renderer');
import Renderer = require('../renderers/Renderer');
import WebGLRenderer = require('../renderers/WebGLRenderer');
import RendererParameters = require('../renderers/RendererParameters');
import DrawList = require('../drawLists/DrawList');
import UniformProvider = require('../core/UniformProvider');
import expectArg = require('../checks/expectArg');
import Color = require('../core/Color');

let webGLRenderer = function(canvas: HTMLCanvasElement): WebGLRenderer {

    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

    let base: Renderer = renderer(canvas);
    var gl: WebGLRenderingContext;
    var glId: string;
    var autoClear: boolean = true;
    var clearColor: Color = Color.fromRGB(0, 0, 0);
    var clearAlpha: number = 0;

    let self: WebGLRenderer = {
      contextFree() {
        gl = void 0;
        glId = void 0;
        return base.contextFree();
      },
      contextGain(context: WebGLRenderingContext, contextId: string) {
        expectArg('contextId', contextId).toBeString();
        let attributes: WebGLContextAttributes = context.getContextAttributes();
        console.log(context.getParameter(context.VERSION));
        console.log("alpha                 => " + attributes.alpha);
        console.log("antialias             => " + attributes.antialias);
        console.log("depth                 => " + attributes.depth);
        console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
        console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
        console.log("stencil               => " + attributes.stencil);
        gl = context;
        glId = contextId;
        gl.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearAlpha);
        gl.clearDepth(1.0); 
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.viewport(0, 0, canvas.width, canvas.height);
        return base.contextGain(context, contextId);
      },
      contextLoss() {
        gl = void 0;
        glId = void 0;
        return base.contextLoss();
      },
      hasContext() {
        return base.hasContext();
      },
      get autoClear(): boolean {
        return autoClear;
      },
      set autoClear(value: boolean) {
        expectArg('autoClear', value).toBeBoolean();
        autoClear = value;
      },
      clearColor(red: number, green: number, blue: number, alpha: number): WebGLRenderer {
        clearColor.red = red;
        clearColor.green = green;
        clearColor.blue = blue;
        clearAlpha = alpha;
        if (gl) {
          gl.clearColor(red, green, blue, alpha);
        }
        return self;
      },
      render(drawList: DrawList, view: UniformProvider) {
        if (autoClear && gl) {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        return base.render(drawList, view);
      }
    };

    return self;
};

export = webGLRenderer;
