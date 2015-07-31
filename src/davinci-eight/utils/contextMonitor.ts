import RenderingContextMonitor = require('../utils/RenderingContextMonitor');
import RenderingContextUser = require('../core/RenderingContextUser');
import uuid4 = require('../utils/uuid4')
import initWebGL = require('../renderers/initWebGL');
import expectArg = require('../checks/expectArg');

function contextMonitor(
  canvas: HTMLCanvasElement,
  attributes?: {
    alpha?: boolean,
    antialias?: boolean,
    depth?: boolean,
    premultipliedAlpha?: boolean,
    preserveDrawingBuffer?: boolean,
    stencil?: boolean
  }
  ): RenderingContextMonitor {

  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

  let users: RenderingContextUser[] = [];
  var context: WebGLRenderingContext;
  var contextId: string;

  let webGLContextLost = function(event: Event) {
    event.preventDefault();
    context = void 0;
    contextId = void 0;
    users.forEach(function(user: RenderingContextUser) {
      user.contextLoss();
    });
  };

  let webGLContextRestored = function(event: Event) {
    event.preventDefault();
    context = initWebGL(canvas, attributes);
    contextId = uuid4().generate();
    users.forEach(function(user: RenderingContextUser) {
      user.contextGain(context, contextId);
    });
  };

  var self: RenderingContextMonitor = {
    start() {
      context = initWebGL(canvas, attributes);
      contextId = uuid4().generate();
      canvas.addEventListener('webglcontextlost', webGLContextLost, false);
      canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
      users.forEach(function(user: RenderingContextUser) {
        user.contextGain(context, contextId);
      });
      return self;
    },
    stop() {
      context = void 0;
      contextId = void 0;
      users.forEach(function(user: RenderingContextUser) {
        user.contextFree();
      });
      canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
      canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
      return self;
    },
    addContextUser(user: RenderingContextUser) {
      expectArg('user', user).toBeObject();
      users.push(user);
      if (context && !user.hasContext()) {
        user.contextGain(context, contextId)
      }
      return self;
    },
    get context() {
      return context;
    }
  };

  return self;
};

export = contextMonitor;
