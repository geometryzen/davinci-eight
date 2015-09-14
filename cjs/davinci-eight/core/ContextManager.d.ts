import IUnknown = require('../core/IUnknown');
import ContextListener = require('../core/ContextListener');
import Buffer = require('../core/Buffer');
import Mesh = require('../dfx/Mesh');
import DrawElements = require('../dfx/DrawElements');
import Texture2D = require('../core/Texture2D');
import TextureCubeMap = require('../core/TextureCubeMap');
interface ContextManager extends IUnknown {
    start(): ContextManager;
    stop(): ContextManager;
    addContextListener(user: ContextListener): ContextManager;
    removeContextListener(user: ContextListener): ContextManager;
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    clearDepth(depth: number): void;
    createArrayBuffer(): Buffer;
    createElementArrayBuffer(): Buffer;
    createDrawElementsMesh(elements: DrawElements, mode: number, usage?: number): Mesh;
    createTexture2D(): Texture2D;
    createTextureCubeMap(): TextureCubeMap;
    drawArrays(mode: number, first: number, count: number): void;
    drawElements(mode: number, count: number, type: number, offset: number): void;
    depthFunc(func: number): void;
    enable(capability: number): void;
    context: WebGLRenderingContext;
    mirror: boolean;
}
export = ContextManager;
