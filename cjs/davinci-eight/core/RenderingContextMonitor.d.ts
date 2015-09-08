import IUnknown = require('../core/IUnknown');
import RenderingContextUser = require('../core/RenderingContextUser');
import Texture = require('../resources/Texture');
import ArrayBuffer = require('../core/ArrayBuffer');
interface RenderingContextMonitor extends IUnknown {
    start(): RenderingContextMonitor;
    stop(): RenderingContextMonitor;
    addContextUser(user: RenderingContextUser): RenderingContextMonitor;
    removeContextUser(user: RenderingContextUser): RenderingContextMonitor;
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    clearDepth(depth: number): void;
    drawArrays(mode: number, first: number, count: number): void;
    drawElements(mode: number, count: number, type: number, offset: number): void;
    depthFunc(func: number): void;
    enable(capability: number): void;
    context: WebGLRenderingContext;
    texture(): Texture;
    vertexBuffer(): ArrayBuffer;
    mirror: boolean;
}
export = RenderingContextMonitor;
