import RenderingContextUser = require('../core/RenderingContextUser');
interface RenderingContextMonitor {
    start(): void;
    stop(): void;
    addContextUser(user: RenderingContextUser): any;
    context: WebGLRenderingContext;
}
export = RenderingContextMonitor;
