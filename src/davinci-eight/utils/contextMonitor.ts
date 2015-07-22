import RenderingContextMonitor = require('../utils/RenderingContextMonitor');
import RenderingContextUser = require('../core/RenderingContextUser');
import uuid4 = require('../utils/uuid4')
import initWebGL = require('../renderers/initWebGL');

var contextMonitor = function(canvas: HTMLCanvasElement, attributes: any): RenderingContextMonitor {

  var users: RenderingContextUser[] = [];
  var context: WebGLRenderingContext;
  var contextId: string;

  var webGLContextLost = function(event: Event) {
    event.preventDefault();
    context = void 0;
    contextId = void 0;
    users.forEach(function(user: RenderingContextUser) {
      user.contextLoss();
    });
  };

  var webGLContextRestored = function(event: Event) {
    event.preventDefault();
    context = initWebGL(canvas, attributes);
    contextId = uuid4().generate();
    users.forEach(function(user: RenderingContextUser) {
      user.contextGain(context, contextId);
    });
  };

  var publicAPI: RenderingContextMonitor = {
    start() {
      context = initWebGL(canvas, attributes);
      contextId = uuid4().generate();
      canvas.addEventListener('webglcontextlost', webGLContextLost, false);
      canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
      users.forEach(function(user: RenderingContextUser) {
        user.contextGain(context, contextId);
      });
    },
    stop() {
      context = void 0;
      contextId = void 0;
      users.forEach(function(user: RenderingContextUser) {
        user.contextFree();
      });
      canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
      canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
    },
    addContextUser(user: RenderingContextUser) {
      users.push(user);
      if (context && !user.hasContext()) {
        user.contextGain(context, contextId)
      }
    }
  };

  return publicAPI;
};

export = contextMonitor;
