import RenderingContextProxy = require('../utils/RenderingContextProxy');
import RenderingContextUser = require('../core/RenderingContextUser');
import initWebGL = require('../renderers/initWebGL');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import Texture = require('../resources/Texture');

function contextProxy(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): RenderingContextProxy {

  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

  let users: RenderingContextUser[] = [];
  var context: WebGLRenderingContext;
  var refCount: number = 1;

  let webGLContextLost = function(event: Event) {
    event.preventDefault();
    context = void 0;
    users.forEach(function(user: RenderingContextUser) {
      user.contextLoss();
    });
  };

  let webGLContextRestored = function(event: Event) {
    event.preventDefault();
    context = initWebGL(canvas, attributes);
    users.forEach(function(user: RenderingContextUser) {
      user.contextGain(context);
    });
  };

  var self: RenderingContextProxy = {
    start(): RenderingContextProxy {
      context = initWebGL(canvas, attributes);
      canvas.addEventListener('webglcontextlost', webGLContextLost, false);
      canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
      users.forEach(function(user: RenderingContextUser) {user.contextGain(context);});
      return self;
    },
    stop(): RenderingContextProxy {
      context = void 0;
      users.forEach(function(user: RenderingContextUser) {user.contextFree();});
      canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
      canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
      return self;
    },
    addContextUser(user: RenderingContextUser): RenderingContextProxy {
      expectArg('user', user).toBeObject();
      user.addRef();
      users.push(user);
      if (context) {
        user.contextGain(context)
      }
      return self;
    },
    removeContextUser(user: RenderingContextUser): RenderingContextProxy {
      expectArg('user', user).toBeObject();
      let index = users.indexOf(user);
      if (index >= 0) {
        users.splice(index, 1);
        user.release();
      }
      return self;
    },
    get context() {
      if (isDefined(context)) {
        return context;
      }
      else {
        console.warn("property context: WebGLRenderingContext is not defined. Either context has been lost or start() not called.");
        return void 0;
      }
    },
    addRef(): number {
      refCount++;
      console.log("monitor.addRef() => " + refCount);
      return refCount;
    },
    release(): number {
      refCount--;
      console.log("monitor.release() => " + refCount);
      if (refCount === 0) {
        while(users.length > 0) {
          users.pop().release();
        }
      }
      return refCount;
    },
    clearColor(red: number, green: number, blue: number, alpha: number): void {
      if (context) {
        return context.clearColor(red, green, blue, alpha);
      }
    },
    clearDepth(depth: number): void {
      if (context) {
        return context.clearDepth(depth);
      }
    },
    drawArrays(mode: number, first: number, count: number): void {
      if (context) {
        return context.drawArrays(mode, first, count);
      }
    },
    drawElements(mode: number, count: number, type: number, offset: number): void {
      if (context) {
        return context.drawElements(mode, count, type, offset);
      }
    },
    depthFunc(func: number): void {
      if (context) {
        return context.depthFunc(func);
      }
    },
    enable(capability: number): void {
      if (context) {
        return context.enable(capability);
      }
    },
    createTexture(): Texture {
      let texture = new Texture();
      self.addContextUser(texture);
      return texture;
    }
  };
  return self;
};

export = contextProxy;