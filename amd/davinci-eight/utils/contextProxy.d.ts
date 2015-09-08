import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare function contextProxy(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): RenderingContextMonitor;
export = contextProxy;
