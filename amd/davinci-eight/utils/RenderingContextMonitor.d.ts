import RenderingContextUser = require('../core/RenderingContextUser');
interface RenderingContextMonitor {
    start(context: WebGLRenderingContext): void;
    stop(): void;
    addContextUser(user: RenderingContextUser): any;
}
export = RenderingContextMonitor;
