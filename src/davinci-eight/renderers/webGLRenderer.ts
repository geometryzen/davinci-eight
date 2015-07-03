/// <reference path="../core/DrawContext.d.ts" />
/// <reference path="../cameras/Camera.d.ts" />
/// <reference path="../scenes/Scene.d.ts" />
/// <reference path="Renderer.d.ts" />
/// <reference path="RendererParameters.d.ts" />
import core = require('davinci-eight/core');

class FrameworkDrawContext implements DrawContext {
  private startTime: number;
  private frameTime: number;
  constructor() {
    this.startTime = Date.now();
    this.frameTime = 0;
  }
  time(): number {
    return this.frameTime;
  }
  frameBegin(): void {
  }
  frameEnd(): void {
    this.frameTime = Date.now() - this.startTime
  }
}

function initWebGL(canvas: HTMLCanvasElement, attributes: any): WebGLRenderingContext {
  var context: WebGLRenderingContext;
  
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    context = <WebGLRenderingContext>(canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
  }
  catch(e) {
  }
  
  if (context) {
    return context;
  }
  else {
    throw new Error("Unable to initialize WebGL. Your browser may not support it.");
  }
}

var renderer = function(parameters?: RendererParameters): Renderer {

    parameters = parameters || {};

    var canvas: HTMLCanvasElement = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');
    var alpha: boolean = parameters.alpha !== undefined ? parameters.alpha : false;
    var depth: boolean = parameters.depth !== undefined ? parameters.depth : true;
    var stencil: boolean = parameters.stencil !== undefined ? parameters.stencil : true;
    var antialias: boolean = parameters.antialias !== undefined ? parameters.antialias : false;
    var premultipliedAlpha: boolean = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
    var preserveDrawingBuffer: boolean = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

    var drawContext = new FrameworkDrawContext();
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

    var publicAPI: Renderer = {
      get canvas() { return canvas; },
      get context(): WebGLRenderingContext { return context;},
      contextFree: function() {
        context = void 0;
      },
      contextGain: function(contextArg: WebGLRenderingContext, contextGainId: string) {
        context = contextArg;
        context.clearColor(32 / 256, 32 / 256, 32 / 256, 1.0);
        context.enable(context.DEPTH_TEST);
      },
      contextLoss: function() {
      },
      hasContext: function() {
        return !!context;
      },
      clearColor: function(r: number, g: number, b: number, a: number) {
        if (context) {
          context.clearColor(r, g, b, a);
        }
      },
      render(scene: Scene) {
        drawContext.frameBegin();
        context.clearColor(0.8, 0.8, 0.8, 1.0);
        context.enable(context.DEPTH_TEST);
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

        var drawGroups: {[programId:string]: Drawable[]} = {};
        if (!scene.hasContext()) {
          scene.contextGain(context, contextGainId);
        }
        var programLoaded;
        var time = drawContext.time();
        var drawHandler = function(drawable: Drawable, index: number) {
          if (!programLoaded) {
            drawable.useProgram(context);
            programLoaded = true;
          }
          drawable.draw(context, time);
        };
        for (var drawGroupName in scene.drawGroups) {
          programLoaded = false;
          scene.drawGroups[drawGroupName].forEach(drawHandler);
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


    context = initWebGL(canvas, attributes);
    contextGainId = Math.random().toString();
    setViewport(0, 0, canvas.width, canvas.height);

    return publicAPI;
};

export = renderer;
