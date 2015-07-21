import core = require('davinci-eight/core');
import Color = require('../core/Color');
import Drawable = require('../core/Drawable');
import DrawContext = require('../core/DrawContext');
import Renderer = require('../renderers/Renderer');
import RendererParameters = require('../renderers/RendererParameters');
import World = require('../worlds/World');
import UniformProvider = require('../core/UniformProvider');
//import initWebGL = require('../renderers/initWebGL');
//import FrameworkDrawContext = require('../renderers/FrameworkDrawContext');

var renderer = function(parameters?: RendererParameters): Renderer {

    parameters = parameters || {};

    var canvas: HTMLCanvasElement = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');
    var alpha: boolean = parameters.alpha !== undefined ? parameters.alpha : false;
    var depth: boolean = parameters.depth !== undefined ? parameters.depth : true;
    var stencil: boolean = parameters.stencil !== undefined ? parameters.stencil : true;
    var antialias: boolean = parameters.antialias !== undefined ? parameters.antialias : false;
    var premultipliedAlpha: boolean = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
    var preserveDrawingBuffer: boolean = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

    //var drawContext = new FrameworkDrawContext();
    var context: WebGLRenderingContext;
    var contextGainId: string;
    var devicePixelRatio = 1;
    var autoClearColor: boolean = true;
    var autoClearDepth: boolean = true;

    function setViewport(x: number, y: number, width: number, height: number): void {
      if (context) {
        context.viewport(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, height * devicePixelRatio);
      }
    }

    function autoClear() {
      var mask: number = 0;
      if (context)
      {
        if (autoClearColor)
        {
          mask |= context.COLOR_BUFFER_BIT;
        }
        if (autoClearDepth)
        {
          mask |= context.DEPTH_BUFFER_BIT;
        }
        context.clear(mask);
      }
    }

    var publicAPI: Renderer = {
      get domElement() { return canvas; },
      get context(): WebGLRenderingContext { return context;},
      contextFree: function() {
        context = void 0;
      },
      contextGain: function(contextArg: WebGLRenderingContext, contextGainId: string) {
        context = contextArg;
      },
      contextLoss: function() {
        context = void 0;
      },
      hasContext: function() {
        return !!context;
      },
      render(world: World, views: UniformProvider[]) {
        if (context) {
          var drawGroups: {[programId:string]: Drawable[]} = {};
          if (!world.hasContext()) {
            world.contextGain(context, contextGainId);
          }
          var programLoaded;
          var drawHandler = function(drawable: Drawable, index: number) {
            if (!programLoaded) {
              drawable.useProgram();
              programLoaded = true;
            }
            views.forEach(function(view) {
              drawable.draw(view);
            });
          };
          for (var drawGroupName in world.drawGroups) {
            programLoaded = false;
            world.drawGroups[drawGroupName].forEach(drawHandler);
          }
        }
      },
      setViewport: setViewport,
      setSize(width: number, height: number, updateStyle?: boolean)
      {
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        if (updateStyle !== false) {
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
        }
        setViewport(0, 0, width, height);
      }
    };

    var attributes =
    {
      'alpha': alpha,
      'depth': depth,
      'stencil': stencil,
      'antialias': antialias,
      'premultipliedAlpha': premultipliedAlpha,
      'preserveDrawingBuffer': preserveDrawingBuffer
    };

    return publicAPI;
};

export = renderer;
