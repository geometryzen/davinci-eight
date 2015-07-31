import core = require('davinci-eight/core');
import Drawable = require('../core/Drawable');
import Renderer = require('../renderers/Renderer');
import RendererParameters = require('../renderers/RendererParameters');
import World = require('../worlds/World');
import UniformProvider = require('../core/UniformProvider');
import expectArg = require('../checks/expectArg');

let renderer = function(canvas: HTMLCanvasElement, parameters?: RendererParameters): Renderer {

    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

    parameters = parameters || {};

    //var drawContext = new FrameworkDrawContext();
    var gl: WebGLRenderingContext;
    var gid: string;

    var publicAPI: Renderer = {
      get canvas() { return canvas; },
      get context(): WebGLRenderingContext { return gl;},
      contextFree() {
        gl = void 0;
        gid = void 0;
      },
      contextGain(context: WebGLRenderingContext, contextIdArg: string) {
        gl = context;
        gid = contextIdArg;
      },
      contextLoss() {
        gl = void 0;
        gid = void 0;
      },
      hasContext() {
        return !!gl;
      },
      render(world: World, views: UniformProvider[]) {
        expectArg('world', world).toNotBeNull();
        if (gl) {
          if (!world.hasContext()) {
            world.contextGain(gl, gid);
          }
          var programLoaded;
          for (var drawGroupName in world.drawGroups) {
            programLoaded = false;
            world.drawGroups[drawGroupName].forEach(function(drawable: Drawable) {
              if (!programLoaded) {
                drawable.useProgram();
                programLoaded = true;
              }
              views.forEach(function(view) {
                drawable.draw(view);
              });
            });
          }
        }
        else {
          console.warn("renderer is unable to render because WebGLRenderingContext is missing");
        }
      },
    };

    return publicAPI;
};

export = renderer;
