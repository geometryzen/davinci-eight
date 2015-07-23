import RenderingContextUser = require('../core/RenderingContextUser');

interface RenderingContextMonitor {
  start(): void;
  stop(): void;
  addContextUser(user: RenderingContextUser);
  context: WebGLRenderingContext;
}

export = RenderingContextMonitor;
