import RenderingContextUser = require('../core/RenderingContextUser');

interface RenderingContextMonitor {
  start(): RenderingContextMonitor;
  stop(): RenderingContextMonitor;
  addContextUser(user: RenderingContextUser): RenderingContextMonitor;
  context: WebGLRenderingContext;
}

export = RenderingContextMonitor;
