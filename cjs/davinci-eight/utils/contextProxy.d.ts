import ContextManager = require('../core/ContextManager');
declare function contextProxy(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): ContextManager;
export = contextProxy;
