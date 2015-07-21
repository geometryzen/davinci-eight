import RenderingContextMonitor = require('../utils/RenderingContextMonitor');
import RenderingContextUser = require('../core/RenderingContextUser');
import uuid4 = require('../utils/uuid4')
import initWebGL = require('../renderers/initWebGL');

var contextMonitor = function(canvas: HTMLCanvasElement, attributes: any): RenderingContextMonitor {

  var users: RenderingContextUser[] = [];

  var webGLContextLost = function(event: Event) {
    event.preventDefault();
    users.forEach(function(user: RenderingContextUser) {
      user.contextLoss();
    });
  };

  var webGLContextRestored = function(event: Event) {
    event.preventDefault();
    let context: WebGLRenderingContext = initWebGL(canvas, attributes);
    let contextId: string = uuid4().generate();
    users.forEach(function(user: RenderingContextUser) {
      user.contextGain(context, contextId);
    });
  };

  var publicAPI: RenderingContextMonitor = {
    start: function(context?: WebGLRenderingContext) {
      context = context || initWebGL(canvas, attributes);
      canvas.addEventListener('webglcontextlost', webGLContextLost, false);
      canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
      let contextId: string = uuid4().generate();
      users.forEach(function(user: RenderingContextUser) {
        user.contextGain(context, contextId);
      });
    },
    stop: function() {
      users.forEach(function(user: RenderingContextUser) {
        user.contextFree();
      });
      canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
      canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
    },
    addContextUser(user: RenderingContextUser) {
      users.push(user);
    }
  };

  return publicAPI;
};

export = contextMonitor;
