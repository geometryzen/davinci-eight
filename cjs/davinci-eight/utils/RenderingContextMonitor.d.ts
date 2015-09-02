import ReferenceCounted = require('../core/ReferenceCounted');
import RenderingContextUser = require('../core/RenderingContextUser');
interface RenderingContextMonitor extends ReferenceCounted {
    start(): RenderingContextMonitor;
    stop(): RenderingContextMonitor;
    addContextUser(user: RenderingContextUser): RenderingContextMonitor;
    removeContextUser(user: RenderingContextUser): RenderingContextMonitor;
    context: WebGLRenderingContext;
}
export = RenderingContextMonitor;
