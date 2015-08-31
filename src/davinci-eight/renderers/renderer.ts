import core = require('davinci-eight/core');
import Drawable = require('../core/Drawable');
import Renderer = require('../renderers/Renderer');
import RendererParameters = require('../renderers/RendererParameters');
import ShaderProgram = require('../core/ShaderProgram');
import DrawList = require('../drawLists/DrawList');
import UniformProvider = require('../core/UniformProvider');
import expectArg = require('../checks/expectArg');
import Color = require('../core/Color');
import updateUniform = require('../core/updateUniform');
import setUniforms = require('../programs/setUniforms');

let renderer = function(canvas: HTMLCanvasElement, parameters?: RendererParameters): Renderer {

    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

    parameters = parameters || {};

    var gl: WebGLRenderingContext;
    var glId: string;
    var autoClear: boolean = true;
    var clearColor: Color = Color.fromRGB(0, 0, 0);
    var clearAlpha: number = 0;

    let self: Renderer = {
      get canvas() { return canvas; },
      get context(): WebGLRenderingContext { return gl;},
      contextFree() {
        gl = void 0;
        glId = void 0;
      },
      contextGain(context: WebGLRenderingContext, contextId: string) {
        expectArg('contextId', contextId).toBeString();
        let attributes: WebGLContextAttributes = context.getContextAttributes();
        //console.log(context.getParameter(context.VERSION));
        //console.log("alpha                 => " + attributes.alpha);
        //console.log("antialias             => " + attributes.antialias);
        //console.log("depth                 => " + attributes.depth);
        //console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
        //console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
        //console.log("stencil               => " + attributes.stencil);
        gl = context;
        glId = contextId;
        gl.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearAlpha);
        gl.clearDepth(1.0); 
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.viewport(0, 0, canvas.width, canvas.height);
      },
      contextLoss() {
        gl = void 0;
        glId = void 0;
      },
      hasContext() {
        return !!gl;
      },
      get autoClear(): boolean {
        return autoClear;
      },
      set autoClear(value: boolean) {
        expectArg('autoClear', value).toBeBoolean();
        autoClear = value;
      },
      clearColor(red: number, green: number, blue: number, alpha: number): Renderer {
        clearColor.red = red;
        clearColor.green = green;
        clearColor.blue = blue;
        clearAlpha = alpha;
        if (gl) {
          gl.clearColor(red, green, blue, alpha);
        }
        return self;
      },
      render(drawList: DrawList, ambients?: UniformProvider) {
        var program
        expectArg('drawList', drawList).toNotBeNull();
        if (gl) {
          if (autoClear) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          }
          if (!drawList.hasContext()) {
            drawList.contextGain(gl, glId);
          }
          var programLoaded;
          for (var drawGroupName in drawList.drawGroups) {
            programLoaded = false;
            drawList.drawGroups[drawGroupName].forEach(function(drawable: Drawable) {
              if (!programLoaded) {
                let program: ShaderProgram = drawable.program.use();
                if (ambients) {
                  setUniforms(drawable.program.uniformSetters, ambients.getUniformData());
                }
                programLoaded = true;
              }
              drawable.draw();
            });
          }
        }
        else {
          console.warn("renderer is unable to render because WebGLRenderingContext is missing");
        }
      },
    };

    return self;
};

export = renderer;
