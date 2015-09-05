import ReferenceCounted = require('../core/ReferenceCounted');
import RenderingContextUser = require('../core/RenderingContextUser');
interface RenderingContextProxy extends ReferenceCounted {
    start(): RenderingContextProxy;
    stop(): RenderingContextProxy;
    addContextUser(user: RenderingContextUser): RenderingContextProxy;
    removeContextUser(user: RenderingContextUser): RenderingContextProxy;
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    clearDepth(depth: number): void;
    clear(mask: number): void;
    drawArrays(mode: number, first: number, count: number): void;
    depthFunc(func: number): void;
    enable(capability: number): void;
    context: WebGLRenderingContext;
    COLOR_BUFFER_BIT: number;
    DEPTH_BUFFER_BIT: number;
    DEPTH_TEST: number;
    LEQUAL: number;
    LINES: number;
    POINTS: number;
    TRIANGLES: number;
}
export = RenderingContextProxy;
