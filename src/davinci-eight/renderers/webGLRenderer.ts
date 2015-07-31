import renderer = require('../renderers/renderer');
import Renderer = require('../renderers/Renderer');
import WebGLRenderer = require('../renderers/WebGLRenderer');
import RendererParameters = require('../renderers/RendererParameters');
import World = require('../worlds/World');
import UniformProvider = require('../core/UniformProvider');
import expectArg = require('../checks/expectArg');

let webGLRenderer = function(canvas: HTMLCanvasElement): WebGLRenderer {

    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

    var base: Renderer = renderer(canvas);
    var gl: WebGLRenderingContext;

    var self: WebGLRenderer = {
      contextFree() {
        gl = void 0;
        return base.contextFree();
      },
      contextGain(context: WebGLRenderingContext, contextId: string) {
        let attributes: WebGLContextAttributes = context.getContextAttributes();
        console.log(context.getParameter(context.VERSION));
        gl = context;
        gl.clearColor(0.3, 0.3, 0.3, 1.0);
        gl.clearDepth(1.0); 
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.viewport(0, 0, canvas.width, canvas.height);
        return base.contextGain(context, contextId);
      },
      contextLoss() {
        gl = void 0;
        return base.contextLoss();
      },
      hasContext() {
        return base.hasContext();
      },
      render(world: World, views: UniformProvider[]) {
        if (gl) {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        return base.render(world, views);
      }
    };

    return self;
};

export = webGLRenderer;
