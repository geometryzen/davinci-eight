import core = require('davinci-eight/core');
import Drawable = require('../core/Drawable');
import Renderer = require('../renderers/Renderer');
import RendererParameters = require('../renderers/RendererParameters');
import DrawList = require('../drawLists/DrawList');
import UniformProvider = require('../core/UniformProvider');
import expectArg = require('../checks/expectArg');

let renderer = function(canvas: HTMLCanvasElement, parameters?: RendererParameters): Renderer {

    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

    parameters = parameters || {};

    var gl: WebGLRenderingContext;
    var glId: string;

    let self: Renderer = {
      get canvas() { return canvas; },
      get context(): WebGLRenderingContext { return gl;},
      contextFree() {
        gl = void 0;
        glId = void 0;
      },
      contextGain(context: WebGLRenderingContext, contextId: string) {
        expectArg('contextId', contextId).toBeString();
        gl = context;
        glId = contextId;
      },
      contextLoss() {
        gl = void 0;
        glId = void 0;
      },
      hasContext() {
        return !!gl;
      },
      render(drawList: DrawList, view: UniformProvider) {
        expectArg('drawList', drawList).toNotBeNull();
        if (gl) {
          if (!drawList.hasContext()) {
            drawList.contextGain(gl, glId);
          }
          var programLoaded;
          for (var drawGroupName in drawList.drawGroups) {
            programLoaded = false;
            drawList.drawGroups[drawGroupName].forEach(function(drawable: Drawable) {
              if (!programLoaded) {
                drawable.useProgram();
                programLoaded = true;
              }
              drawable.draw(view);
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
